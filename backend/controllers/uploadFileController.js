// upload controller
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const File = require("../models/uploadFileModel");

const UPLOAD_DIR = path.join(__dirname, "../public/assets/memberFile");

exports.uploadFiles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }

    const { buffer, originalname, mimetype, size } = req.file;

    // base64 string বানাও
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${mimetype};base64,${base64String}`;

    // unique filename
    const ext = path.extname(originalname).toLowerCase();
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // directory না থাকলে বানাও, তারপর disk-এ save
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(filepath, buffer);

    // base64 সহ MongoDB তে save
    const newFile = await File.create({
      filename,
      originalname,
      mimetype,
      size,
      url: `/assets/memberFile/${filename}`,
      base64: dataUrl,
    });
    return res.status(201).json({
      message: "File uploaded successfully.",
      file: newFile,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Upload failed.", error: err.message });
  }
};

// GET /members/upload-file
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ message: "Files fetched successfully.", files });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch files.", error: err.message });
  }
};

// GET /members/upload-file/:id
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }
    return res
      .status(200)
      .json({ message: "File fetched successfully.", file });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch file.", error: err.message });
  }
};

// PUT /members/upload-file/:id
exports.updateFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }

    // পুরনো file টা DB থেকে খোঁজো
    const existingFile = await File.findById(req.params.id);
    if (!existingFile) {
      return res.status(404).json({ message: "File not found." });
    }

    // পুরনো file disk থেকে delete করো
    const oldFilePath = path.join(__dirname, "../public", existingFile.url);
    await fs.unlink(oldFilePath).catch(() => {}); // না পেলেও চলবে

    // নতুন file disk-এ save করো
    const { buffer, originalname, mimetype, size } = req.file;

    // base64 string বানাও
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${mimetype};base64,${base64String}`;

    const ext = path.extname(originalname).toLowerCase();
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(filepath, buffer);

    // DB update করো
    const updatedFile = await File.findByIdAndUpdate(
      req.params.id,
      {
        filename,
        originalname,
        mimetype,
        size,
        url: `/assets/memberFile/${filename}`,
        base64: dataUrl,
      },
      { new: true },
    );

    return res.status(200).json({
      message: "File updated successfully.",
      file: updatedFile,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Update failed.", error: err.message });
  }
};

// DELETE /members/upload-file/:id
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found." });
    }

    // disk থেকে delete করো
    const filepath = path.join(__dirname, "../public", file.url);
    await fs.unlink(filepath).catch(() => {});

    // DB থেকে delete করো
    await File.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "File deleted successfully." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Delete failed.", error: err.message });
  }
};
