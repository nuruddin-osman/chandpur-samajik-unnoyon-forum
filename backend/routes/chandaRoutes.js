// chandaRoutes.js

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/chandaController");
const { isAdmin, verifyToken } = require("../middleware/auth");

router.post("/chanda", verifyToken, isAdmin, ctrl.createChanda);
router.get("/chanda", verifyToken, isAdmin, ctrl.getAllChanda);
router.get("/chanda/:memberId", verifyToken, ctrl.getMemberChanda);
router.patch("/chanda/:id", verifyToken, isAdmin, ctrl.updateChanda);
router.delete("/chanda/:id", verifyToken, isAdmin, ctrl.deleteChanda);

module.exports = router;
