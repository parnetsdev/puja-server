const express = require("express");

const {protect,isAdmin} = require("../middleware/authMiddleware");
const {
  createDevotes,
  getDevotee,
  EditDevotee,
} = require("../controllers/Devotee.controllers");
const router = express.Router();

router.post("/devotees",protect,isAdmin, createDevotes);
router.get("/devoteesget", getDevotee);
router.put("/devotees/:id",protect,isAdmin, EditDevotee);
module.exports = router;
