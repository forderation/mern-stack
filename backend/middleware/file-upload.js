const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limits: 3000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "upload/images");
    },
    filename: (req, file, cb) => {
      const fileExt = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + fileExt);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid image type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
