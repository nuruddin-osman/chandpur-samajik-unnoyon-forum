// uploadFileModel.js

const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalname: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    base64: { type: String, required: true },
  },
  { timestamps: true },
);

const File = mongoose.model("File", fileSchema);

module.exports = File;
