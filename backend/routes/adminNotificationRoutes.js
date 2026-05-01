// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getNotifications,
  approveMember,
  rejectMember,
} = require("../controllers/AdminNotificationController");
const { isAdmin, verifyToken } = require("../middleware/auth");

// routes/adminNotificationRoutes.js
router.get("/notifications", verifyToken, isAdmin, getNotifications);
router.patch(
  "/notifications/members/:id/approve",
  verifyToken,
  isAdmin,
  approveMember,
);
router.patch(
  "/notifications/members/:id/reject",
  verifyToken,
  isAdmin,
  rejectMember,
);

module.exports = router;
