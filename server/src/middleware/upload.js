const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');
const config = require('../config');

// Ensure local upload directory exists as fallback
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

let storage;

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  // Cloudinary Storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      // Determine folder based on fieldName or route
      let folder = 'vastu max/documents';
      if (file.fieldname === 'profilePicture' || file.fieldname === 'avatar') {
        folder = 'vastu max/avatars';
      } else if (file.fieldname === 'images' || file.fieldname === 'vehicleImages') {
        folder = 'vastu max/vehicles';
      }

      // Check allowed formats
      const fileExt = path.extname(file.originalname).toLowerCase().replace('.', '');
      let format = 'jpeg';
      if (['jpg', 'jpeg', 'png', 'webp', 'pdf'].includes(fileExt)) {
        format = fileExt === 'pdf' ? 'pdf' : 'webp';
      }

      return {
        folder: folder,
        format: format,
        resource_type: format === 'pdf' ? 'raw' : 'image',
        public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')}`,
      };
    },
  });
  console.log('☁️  Multer configured with Cloudinary storage.');
} else {
  // Local Disk Storage Fallback
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });
  console.log('💾 Multer configured with Local Disk storage fallback.');
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, webp) and PDF documents are allowed.'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

module.exports = upload;
