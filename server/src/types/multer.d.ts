// Minimal declaration to satisfy TypeScript when @types/multer is not installed
declare module 'multer' {
  import type { RequestHandler } from 'express';
  const multer: any;
  export = multer;
}

// Also make the Multer file shape available globally in this project via a local type
declare global {
  namespace MulterLocal {
    interface MulterFile {
      fieldname: string;
      originalname: string;
      encoding?: string;
      mimetype?: string;
      size?: number;
      buffer?: Buffer;
      destination?: string;
      filename?: string;
      path?: string;
    }
  }
}

export {};
