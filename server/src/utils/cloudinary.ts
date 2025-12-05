import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

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
} else {
    console.warn('⚠️ Cloudinary credentials missing or incomplete. Uploads will use a placeholder URL in development.');
}
if (CLOUDINARY_ENABLED) {
    // Log masked info to help debugging without leaking secrets
    const masked = `${String(CLOUDINARY_CLOUD_NAME).slice(0, 3)}***`;
    console.log(`✅ Cloudinary configured. cloud_name=${masked}`);
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
        console.warn('⚠️ uploadToCloudinary called but Cloudinary is not configured. Returning placeholder URL.');
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
                console.error('Upload stream error:', err);
                return reject(err);
            });

            // Create a readable stream from buffer
            const { Readable } = require('stream');
            const stream = Readable.from(buffer);

            stream.on('error', (err: Error) => {
                console.error('Readable stream error:', err);
                return reject(err);
            });

            stream.pipe(uploadStream);
        } catch (err) {
            console.error('Cloudinary upload threw synchronously:', err);
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
    try {
        if (!CLOUDINARY_ENABLED) {
            console.warn('⚠️ deleteFromCloudinary called but Cloudinary is not configured. Skipping delete.');
            return;
        }
        // Extract public_id from URL
        const urlParts = url.split('/');
        const fileWithExtension = urlParts[urlParts.length - 1];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${fileWithExtension.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
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
    try {
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error('❌ Error uploading multiple files to Cloudinary:', error);
        throw error;
    }
};

export default cloudinary;