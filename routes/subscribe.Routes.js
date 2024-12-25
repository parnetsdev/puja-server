const express = require("express");
const {
  createSubcribe,
  getSpecificSubscribe,
  ToogleSubscribeStatus,
} = require("../controllers/Subscribe.controllers");
const {protect,isAdmin} = require("../middleware/authMiddleware");
const upload = require("../routes/upload ");

const router = express.Router();

router.post("/subcribe", upload.single("image"),protect,isAdmin, createSubcribe);
router.get("/subcribeget/:id", getSpecificSubscribe);

router.patch("/toogle/:id",protect,isAdmin, ToogleSubscribeStatus);

module.exports = router;
