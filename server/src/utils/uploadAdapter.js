/**
 * Upload adapter abstraction — swap between local disk and Cloudinary/S3
 * without changing controllers or components.
 */
const path = require('path');
const fs = require('fs');
const config = require('../config');

const LOCAL_UPLOAD_DIR = path.join(__dirname, '../../public/uploads');

const ensureUploadDir = () => {
  if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  }
};

const useCloudinary = () =>
  Boolean(config.cloudinary?.cloudName && config.cloudinary?.apiKey && config.cloudinary?.apiSecret);

/**
 * Resolve a stored file reference to a public URL.
 * @param {Express.Multer.File} file
 * @returns {string}
 */
const resolveFileUrl = (file) => {
  if (!file) return '';
  if (file.path?.startsWith('http')) return file.path;
  if (file.secure_url) return file.secure_url;
  if (file.filename) return `/uploads/${file.filename}`;
  return '';
};

/**
 * Resolve multiple files from multer fields object.
 * @param {Record<string, Express.Multer.File[]>} files
 * @param {string} fieldName
 * @returns {string[]}
 */
const resolveFieldUrls = (files, fieldName) => {
  const arr = files?.[fieldName];
  if (!arr?.length) return [];
  return arr.map(resolveFileUrl).filter(Boolean);
};

/**
 * Delete a file by URL (local only; cloud deletion can be added later).
 * @param {string} url
 */
const deleteFile = async (url) => {
  if (!url || url.startsWith('http')) return;
  const filename = path.basename(url);
  const filePath = path.join(LOCAL_UPLOAD_DIR, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  LOCAL_UPLOAD_DIR,
  ensureUploadDir,
  useCloudinary,
  resolveFileUrl,
  resolveFieldUrls,
  deleteFile,
};
