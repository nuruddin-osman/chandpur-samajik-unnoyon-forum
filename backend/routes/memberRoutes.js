// memberRoutes.js

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/memberController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public
router.post("/members/register", ctrl.registerMember);
router.post("/members/login", ctrl.loginMember);

// Protected (লগইন লাগবে)
router.get("/members/type/:memberType", verifyToken, ctrl.getMembersByType);
router.get("/members/:id", verifyToken, ctrl.getMemberById);
router.patch("/members/:id", verifyToken, ctrl.updateMember);

// Admin only
router.get("/members", verifyToken, isAdmin, ctrl.getAllMembers);
router.delete("/members/:id", verifyToken, isAdmin, ctrl.deleteMember);

module.exports = router;
