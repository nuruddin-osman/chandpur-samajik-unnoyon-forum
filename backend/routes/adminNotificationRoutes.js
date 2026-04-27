// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getNotifications,
  approveMember,
  rejectMember,
} = require("../controllers/AdminNotificationController");
const { isAdmin } = require("../middleware/auth");

router.get("/notifications", isAdmin, getNotifications);
router.patch("/notifications/members/:id/approve", isAdmin, approveMember);
router.patch("/notifications/members/:id/reject", isAdmin, rejectMember);

module.exports = router;
