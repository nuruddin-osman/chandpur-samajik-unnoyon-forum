const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/committeeController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.post("/committee", verifyToken, isAdmin, ctrl.addToCommittee);
router.get("/committee", ctrl.getActiveCommittee); // public
router.patch(
  "/committee/:id",
  verifyToken,
  isAdmin,
  ctrl.updateCommitteeMember,
);
router.delete("/committee/:id", verifyToken, isAdmin, ctrl.removeFromCommittee);

module.exports = router;
