// uploadFileRoutes.js

const express = require("express");
const upload = require("../middleware/uploadFile");
const {
  uploadFiles,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFile,
} = require("../controllers/uploadFileController");
const router = express.Router();

router.post("/members/upload-file", upload.single("image"), uploadFiles);
router.get("/members/upload-file", getAllFiles);
router.get("/members/upload-file/:id", getFileById);
router.put("/members/upload-file/:id", upload.single("image"), updateFile);
router.delete("/members/upload-file/:id", deleteFile);

module.exports = router;
