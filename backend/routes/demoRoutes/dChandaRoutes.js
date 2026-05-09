// dChandaRoutes.js

const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/demoController/dChandaController");
const { verifyToken, isAdmin } = require("../../middleware/auth");

// admin
router.post("/cron/chanda", verifyToken, isAdmin, ctrl.createChanda);
router.get("/cron/chanda", verifyToken, isAdmin, ctrl.getAllChanda);
router.patch("/cron/chanda/:id", verifyToken, isAdmin, ctrl.updateChanda);
router.delete("/cron/chanda/:id", verifyToken, isAdmin, ctrl.deleteChanda);

// member
router.get("/cron/chanda/:memberId", verifyToken, ctrl.getMemberChanda);

// development — cron test
router.get("/cron/chanda-run-cron", verifyToken, isAdmin, ctrl.runCronManually);

module.exports = router;
