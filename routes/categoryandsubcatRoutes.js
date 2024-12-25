const express = require("express");
const {
  getSubcategoriesByCategory,
  getCatgeories,
  createCategory,
  createSubcategory,
  ToogleCategoryStatus,
  ToogleSubCategoryStatus,
  getAllCategoriesWithSubcategories,
  getCategoriesWithSubcategoriesAndProducts
} = require("../controllers/allpujaService");
const {protect,isAdmin} = require("../middleware/authMiddleware");
// const upload = require("../routes/upload");
const upload=require('./upload ')
const router = express.Router();

router.get("/gcategories", getSubcategoriesByCategory);
router.get('/getCatgeories',getCatgeories);
router.get("/allcatgewithsub", getAllCategoriesWithSubcategories);
router.get('/allpujaservice',getCategoriesWithSubcategoriesAndProducts)
router.post("/ccategories",upload.single('image'),protect,isAdmin,createCategory);

router.post("/csubcategories",protect,isAdmin, createSubcategory);
router.patch("/categoriestoggle/:id",protect,isAdmin, ToogleCategoryStatus);
router.patch("/subcategoriestoggle/:id",protect,isAdmin, ToogleSubCategoryStatus);


module.exports = router;
