import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// File filter for images only. Use a permissive type for `file` to avoid
// relying on external Multer typings during production builds.
const fileFilter = (
    req: Express.Request,
    file: any,
    cb: multer.FileFilterCallback
) => {
    // Accept images only
    if (file && typeof file.mimetype === 'string' && file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});