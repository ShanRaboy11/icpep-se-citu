import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import { optimizeImage } from './optimize-image';

// Check Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const invalidCloudNameValues = ['website', 'cloud_name', 'your_cloud_name', 'example', 'example_cloud'];

export const CLOUDINARY_ENABLED = Boolean(
    CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET &&
    !invalidCloudNameValues.includes(String(CLOUDINARY_CLOUD_NAME).toLowerCase())
);

if (CLOUDINARY_ENABLED) {
    // Configure Cloudinary
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });
}

// Folders this app uploads into; deletes are limited to these.
const UPLOAD_FOLDERS = [
    'announcements', 'events', 'merch', 'advisors', 'faculty',
    'officers', 'officer-terms', 'sponsors', 'testimonials', 'site',
];

// Looks at the file's own bytes rather than the type the client declared.
export const isSupportedImage = (buffer: Buffer): boolean => {
    if (buffer.length < 12) return false;
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isGif = buffer.subarray(0, 4).toString('ascii') === 'GIF8';
    const isWebp =
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    return isJpeg || isPng || isGif || isWebp;
};

export const isPdf = (buffer: Buffer): boolean =>
    buffer.length > 5 && buffer.subarray(0, 5).toString('ascii') === '%PDF-';

export const uploadDocumentToCloudinary = async (
    buffer: Buffer,
    folder: string
): Promise<UploadApiResponse> => {
    if (!isPdf(buffer)) {
        throw new Error('Unsupported document type');
    }
    if (!CLOUDINARY_ENABLED) {
        throw new Error('Uploads are not configured');
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                public_id: `${folder}/${randomUUID()}.pdf`,
            },
            (error, result) => {
                if (error) return reject(error);
                if (result) return resolve(result);
                reject(new Error('Upload failed'));
            }
        );
        uploadStream.on('error', reject);
        Readable.from(buffer).pipe(uploadStream);
    });
};

/**
 * Upload buffer to Cloudinary
 * @param buffer - File buffer from multer
 * @param folder - Cloudinary folder name
 * @returns Upload result with secure_url
 */
export const uploadToCloudinary = async (
    buffer: Buffer,
    folder: string
): Promise<UploadApiResponse> => {
    if (!isSupportedImage(buffer)) {
        throw new Error('Unsupported image type');
    }

    // If Cloudinary isn't configured, return a placeholder response to avoid 500s during local dev
    if (!CLOUDINARY_ENABLED) {
        return { secure_url: 'https://via.placeholder.com/1200x630.png?text=No+Image' } as UploadApiResponse;
    }

    const optimized = await optimizeImage(buffer);

    return new Promise((resolve, reject) => {
        try {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result) return resolve(result);
                    reject(new Error('Upload failed'));
                }
            );

            // Attach error handler on the upload stream to avoid unhandled rejections
            uploadStream.on('error', (err: Error) => {
                return reject(err);
            });

            // Create a readable stream from buffer
            const stream = Readable.from(optimized);

            stream.on('error', (err: Error) => {
                return reject(err);
            });

            stream.pipe(uploadStream);
        } catch {
            // Fall back to placeholder instead of crashing the process
            return resolve({ secure_url: 'https://via.placeholder.com/1200x630.png?text=No+Image' } as UploadApiResponse);
        }
    });
};

/**
 * Delete file from Cloudinary
 * @param url - Cloudinary URL of the file
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
    if (!CLOUDINARY_ENABLED) return;

    // Only our own uploads can be deleted, whatever URL a request stored on a record.
    // https://res.cloudinary.com/<cloud>/image/upload/v1699999999/folder/sub/name.jpg -> folder/sub/name
    const match = url.match(
        /^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[A-Za-z0-9]+)?(?:\?.*)?$/
    );
    if (!match || match[1] !== CLOUDINARY_CLOUD_NAME) return;

    const publicId = decodeURIComponent(match[2]);
    if (publicId.includes('..') || !UPLOAD_FOLDERS.some((folder) => publicId.startsWith(`${folder}/`))) return;

    await cloudinary.uploader.destroy(publicId);
};

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of file buffers
 * @param folder - Cloudinary folder name
 * @returns Array of upload results
 */
export const uploadMultipleToCloudinary = async (
    files: { buffer: Buffer }[],
    folder: string
): Promise<UploadApiResponse[]> => {
    const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer, folder));
    return Promise.all(uploadPromises);
};

export default cloudinary;