// dChandaRoutes.js

const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/demoController/dChandaController");
const { verifyToken, isAdmin } = require("../../middleware/auth");

// admin
router.post("/chanda", verifyToken, isAdmin, ctrl.createChanda);
router.get("/chanda", verifyToken, isAdmin, ctrl.getAllChanda);
router.patch("/chanda/:id", verifyToken, isAdmin, ctrl.updateChanda);
router.delete("/chanda/:id", verifyToken, isAdmin, ctrl.deleteChanda);

// member
router.get("/chanda/:memberId", verifyToken, ctrl.getMemberChanda);

// development — cron test
router.get("/chanda-run-cron", verifyToken, isAdmin, ctrl.runCronManually);

module.exports = router;
