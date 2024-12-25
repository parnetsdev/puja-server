const express = require("express");

const {protect,isAdmin} = require("../middleware/authMiddleware");
// const upload = require("../routes/upload");
const { createProfile, getProfile, editProfile, deleteProfile } = require("../controllers/TalktoAstroguru.controllers");
const upload = require("./upload ");
const router = express.Router();


router.post('/profile',protect,isAdmin, createProfile);
router.get('/profile', getProfile); 
router.put('/profile/:id',protect,isAdmin, editProfile); 
router.delete('/profile/:id',protect,isAdmin, deleteProfile); 

module.exports = router;


