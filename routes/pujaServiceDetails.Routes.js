const express = require("express");
const {pujaDetailsCreate,TooglePujaStatus,updatePuja} = require("../controllers/pujaServiceDetails");
const {protect,isAdmin} = require("../middleware/authMiddleware");
const upload = require("../routes/upload ");


const router = express.Router();
router.post("/pujadetails",upload.single('image'),protect,isAdmin, pujaDetailsCreate);
router.put("/pujadetailsedit/:id",upload.single('image'),protect,isAdmin, updatePuja);
router.patch('/pujatoggle/:id',protect,isAdmin,TooglePujaStatus);

module.exports = router;
