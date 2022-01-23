// Multer
const multer = require("multer");

exports.uploadFile = (imageFile) => {
  // Storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });
  // File filter
  const fileFilter = function (req, file, cb) {
    if (file.filename === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|JPEG|jpeg|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Cuma bisa upload file gambar",
        };
      }
      return cb(new Error("Cuma bisa upload file gambar"), false);
    }
    cb(null, true);
  };

  //   Limit size
  const sizeInMb = 10;
  const maxSize = sizeInMb * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, function (err) {
      //   Jika yang diupload bukan gambar
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      //   Jika tidak upload gambar
      if (!req.file && !err) {
        return req.status(400).send({
          message: "Silahkan upload file photo mu",
        });
      }

      //   Pengecekan
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: `Maksimal ukuran fotonya ${sizeInMb}Mb`,
          });
        }

        return res.status(400).send(err);
      }

      return next();
    });
  };
};
