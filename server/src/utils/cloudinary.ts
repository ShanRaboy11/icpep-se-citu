import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

// Check Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const invalidCloudNameValues = ['website', 'cloud_name', 'your_cloud_name', 'example', 'example_cloud'];

const CLOUDINARY_ENABLED = Boolean(
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

/**
 * Upload buffer to Cloudinary
 * @param buffer - File buffer from multer
 * @param folder - Cloudinary folder name
 * @returns Upload result with secure_url
 */
export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string
): Promise<UploadApiResponse> => {
    // If Cloudinary isn't configured, return a placeholder response to avoid 500s during local dev
    if (!CLOUDINARY_ENABLED) {
        return Promise.resolve({ secure_url: 'https://via.placeholder.com/1200x630.png?text=No+Image' } as any);
    }

    return new Promise((resolve, reject) => {
        try {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                    transformation: [
                        { width: 1200, height: 630, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' },
                    ],
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
            const stream = Readable.from(buffer);

            stream.on('error', (err: Error) => {
                return reject(err);
            });

            stream.pipe(uploadStream);
        } catch {
            // Fall back to placeholder instead of crashing the process
            return resolve({ secure_url: 'https://via.placeholder.com/1200x630.png?text=No+Image' } as any);
        }
    });
};

/**
 * Delete file from Cloudinary
 * @param url - Cloudinary URL of the file
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
    if (!CLOUDINARY_ENABLED) return;

    // .../upload/v1699999999/folder/sub/name.jpg -> folder/sub/name
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[A-Za-z0-9]+)?(?:\?.*)?$/);
    if (!match) return;

    await cloudinary.uploader.destroy(decodeURIComponent(match[1]));
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