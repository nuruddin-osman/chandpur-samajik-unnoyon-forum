const upload = require("../middleware/uploadFile");

exports.uploadFiles = (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
};
