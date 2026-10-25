import multer from 'multer';

// Configure multer to store files in memory
const storage = multer.memoryStorage();

// Only these formats are accepted. SVG is left out on purpose: it can carry
// script. The bytes are checked again before anything is uploaded (see
// utils/cloudinary.ts), since the declared type is just what the client claims.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// File filter for images only. Use a permissive type for `file` to avoid
// relying on external Multer typings during production builds.
const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    // Accept images only
    if (file && typeof file.mimetype === 'string' && ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, WebP or GIF images are allowed.'));
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

export const MAX_PDF_SIZE_MB = 10;

export const uploadPdf = multer({
    storage: storage,
    fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (file && file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'));
        }
    },
    limits: {
        fileSize: MAX_PDF_SIZE_MB * 1024 * 1024,
    },
});
