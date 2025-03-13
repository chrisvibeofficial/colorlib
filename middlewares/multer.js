const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    const randomNum = new Date().toString() + '_' + Math.round(Math.random() * 1E9);
    const ext = file.mimetype.split('/')[1];
    cb(null, `IMG_${randomNum}.${ext}`)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    new Error('Invalid file format: Images only')
  }
};

const limits = {
  limits: 1024 * 1024 * 10
};

const uploads = multer({
  storage,
  fileFilter,
  limits
});

module.exports = uploads;