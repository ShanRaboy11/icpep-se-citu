"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleToCloudinary = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.v2.config({
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
const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: 'auto',
            transformation: [
                { width: 1200, height: 630, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        }, (error, result) => {
            if (error)
                return reject(error);
            if (result)
                return resolve(result);
            reject(new Error('Upload failed'));
        });
        // Create a readable stream from buffer
        const { Readable } = require('stream');
        const stream = Readable.from(buffer);
        stream.pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
/**
 * Delete file from Cloudinary
 * @param url - Cloudinary URL of the file
 */
const deleteFromCloudinary = async (url) => {
    try {
        // Extract public_id from URL
        const urlParts = url.split('/');
        const fileWithExtension = urlParts[urlParts.length - 1];
        const folderName = urlParts[urlParts.length - 2];
        const publicId = `${folderName}/${fileWithExtension.split('.')[0]}`;
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
/**
 * Upload multiple files to Cloudinary
 * @param files - Array of file buffers
 * @param folder - Cloudinary folder name
 * @returns Array of upload results
 */
const uploadMultipleToCloudinary = async (files, folder) => {
    const uploadPromises = files.map((file) => (0, exports.uploadToCloudinary)(file.buffer, folder));
    return Promise.all(uploadPromises);
};
exports.uploadMultipleToCloudinary = uploadMultipleToCloudinary;
exports.default = cloudinary_1.v2;
