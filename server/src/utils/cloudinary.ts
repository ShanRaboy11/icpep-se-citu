import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    return new Promise((resolve, reject) => {
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

        // Create a readable stream from buffer
        const { Readable } = require('stream');
        const stream = Readable.from(buffer);
        stream.pipe(uploadStream);
    });
};

/**
 * Delete file from Cloudinary
 * @param url - Cloudinary URL of the file
 */
export const deleteFromCloudinary = async (url: string): Promise<void> => {
    try {
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
    return Promise.all(uploadPromises);
};

export default cloudinary;