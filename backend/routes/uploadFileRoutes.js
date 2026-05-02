const express = require("express");
const upload = require("../middleware/uploadFile");
const { uploadFiles } = require("../controllers/uploadFileController");
const router = express.Router();

router.post("/members/upload-file", upload.single("image"), uploadFiles);

module.exports = router;
