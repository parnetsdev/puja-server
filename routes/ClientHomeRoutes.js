const express = require("express");
const {
  ClienthomeBannerGetApi,
  ActivateAcarouselItem,
  DeactivateCarouselItem,
  ToggleStatusOfbanner,
  createBanner,
  editHomeBannerData,
  getallProductsWithCategory,
  getProductsWithFirstCategory
} = require("../controllers/clientHomePage.controller");
const {protect,isAdmin} = require("../middleware/authMiddleware");
const upload = require("../routes/upload ");
const upload2=require('../uploads/upload')
const router = express.Router();

router.get("/banners", ClienthomeBannerGetApi);
router.get("/productwithcategory", getallProductsWithCategory);
router.get("/productwithfirstcategory", getProductsWithFirstCategory);
router.post("/create", upload2.single("backgroundImage"),protect,isAdmin, createBanner);
router.put("/edit/:id", upload2.single("backgroundImage"),protect,isAdmin, editHomeBannerData);

// patch
router.patch("/active/:id",protect,isAdmin, ActivateAcarouselItem);
router.patch("/deactive/:id",protect,isAdmin, DeactivateCarouselItem);
router.patch("/toggle/:id",protect,isAdmin, ToggleStatusOfbanner);

module.exports = router;
