const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/memberFile");
  },
  filename: function (req, file, cb) {
    const extensionName = path.extname(file.originalname);
    const fileNames =
      Date.now() +
      "-" +
      file.originalname.replace(extensionName, "") +
      extensionName;
    cb(null, fileNames);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
