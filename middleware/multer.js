import multer from "multer";

/**
 * Multer storage configuration using memory storage.
 */
const storage = multer.memoryStorage();

/**
 * Multer upload middleware configured with memory storage.
 */
const upload = multer({ storage });

export default upload;
