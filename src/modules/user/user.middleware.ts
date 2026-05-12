import multer from 'multer';
export const cloud = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 1MB
});