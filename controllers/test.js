const {
  Category,
  SubCategory,
} = require("../models/categoryAndSubcategorySchema");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: true });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const subCategories = await SubCategory.find({
      category: categoryId,
      status: true,
    }).populate("category", "title");

    res.json(subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subcategories" });
  }
};

module.exports = { getCategories, getSubCategories };
