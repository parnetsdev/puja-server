const express = require("express");

const {protect,isAdmin} = require("../middleware/authMiddleware");
// const upload = require("../routes/upload");
const {getSocialMediaLinks, updateSocialMediaLinks,createContact,updateContact,getContactById ,getAllContacts} = require("../controllers/Footer.controllers");
const upload=require('./upload ')
const router = express.Router();

router.get('/social-media', getSocialMediaLinks);
router.put('/api/social-media',protect,isAdmin, updateSocialMediaLinks);
router.post('/create-contact',protect,isAdmin, createContact); 
router.get('/contacts', getAllContacts); 
router.get('/contact/:id', getContactById);
router.put('/update-contact/:id',protect,isAdmin, updateContact); 

module.exports=router;