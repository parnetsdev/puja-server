const express = require("express");
const { getCategories, getSubCategories } = require("../controllers/test");
const protect = require("../middleware/authMiddleware");
const upload = require("../routes/upload ");

const router = express.Router();

router.get("/subcategories", getSubCategories);
router.get("/categories", getCategories);

module.exports = router;
