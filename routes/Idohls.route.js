const express = require("express");


// const upload = require("../routes/upload");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/Idohls.controllers");
const upload = require("./upload ");
const router = express.Router();

const {protect,isAdmin} = require("../middleware/authMiddleware");

router.post('/Idolsproducts',upload.single('image'), createProduct);
router.get('/productswith', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/Idolsproducts/:id',protect,isAdmin, updateProduct);
router.delete('/Idolsproducts/:id',protect,isAdmin, deleteProduct);


module.exports=router;