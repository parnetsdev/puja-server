const {
  Category,
  SubCategory,
  validateCategory,
  validateSubCategory,
} = require("../models/categoryAndSubcategorySchema");
const Puja = require("../models/pujadetailsSchema");
const asyncHandler = require("../middleware/asyncHandler");

const getCatgeories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({ status: true }).select("-status -createdAt -updatedAt -smallDescription")
    .lean();

    if (!categories) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(201).json({ categories });
  } catch (error) {
    console.error(error);
    console.log(error);
    return res.status(500).json({ message: "Error fetching categories" });
  }
});

// const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
//   const { catgeoryId } = req.query;

//   if (!catgeoryId) {
//     return res.status(400).json({ message: "category id is required" });
//   }
//   try {
//     const category = await Category.findById(categoryId);
//     if (!category || !category.status) {
//       return res.status(400).json({ message: "Category is not found or not active" });
//     }
//     const subCategories = await SubCategory.find({
//       category: catgeoryId,
//       status: true,
//     }).populate("category", "title");

//     if (!subCategories) {
//       return res.status(400).json({ message: "sub category is not found" });
//     }

//     res.json(subCategories);
//   } catch (error) {
//     console.log(error);
//     console.error(error);
//     return res.status(500).json({ message: "Error fetching subcategories" });
//   }
// });

const getSubcategoriesByCategory = asyncHandler(async (req, res) => {
  const { catgeoryId } = req.query;

  if (!catgeoryId) {
    return res.status(400).json({ message: "category id is required" });
  }
  try {
    const category = await Category.findById(catgeoryId);
    if (!category || !category.status) {
      return res
        .status(400)
        .json({ message: "Category is not found or not active" });
    }
    const subCategories = await SubCategory.find({
      category: catgeoryId,
      status: true,
    }).populate("category", "title");

    if (!subCategories || subCategories.length === 0) {
      return res.status(400).json({ message: "sub category is not found" });
    }

    res.json(subCategories);
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({ message: "Error fetching subcategories" });
  }
});

const createCategory = asyncHandler(async (req, res) => {
  const { title, image, smallDescription, status } = req.body;

  console.log(image, "image");

  if (!req.file) {
    return res.status(400).json({ error: "Image file is required." });
  }

  if (!title && !image && !smallDescription && !status) {
    return res.status(400).json({ error: "please enter the all fields" });
  }

  const validation = validateCategory(req.body); // Directly get the validation result
  if (validation.error) {
    return res.status(400).json({ error: validation.error.details[0].message });
  }
  try {
    const catgeory = new Category({
      title: req.body.title,
      image: req.file.filename,
      smallDescription: req.body.smallDescription,
      status: req.body.status,
    });

    await catgeory.save();

    return res.status(201).json(catgeory);
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).json({ message: "Error creating category" });
  }
});

const createSubcategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(201).json({ error: "please enter the title" });
  }

  const { error } = validateSubCategory(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { title, status, category } = req.body;

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res
        .status(400)
        .json({ message: "Invalid category. Category does not exist." });
    }

    const subCategory = new SubCategory({
      title,
      status,
      category,
    });

    await subCategory.save();

    return res.status(201).json({
      message: "Subcategory created successfully.",
      data: subCategory,
    });
  } catch (error) {
    console.error("Error creating subcategory:", error.message);
    res.status(500).send({ message: "Internal Server Error." });
  }
});

const ToogleCategoryStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "pls Enter a valid" });
  }

  try {
    const id = req.params.id;
    const catgeory = await Category.findById(id);

    if (!catgeory) {
      return res.status(400).json({ message: "Category is not found" });
    }

    const status = !catgeory.status;

    const updateCategory = await Category.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    if (!updateCategory) {
      return res.status(400).json({ message: "not bale to update" });
    }

    return res.status(201).json({
      message: `Catgeory item ${
        status ? "activate" : "deactivated"
      }successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling carousel item status" });
  }
});

const ToogleSubCategoryStatus = asyncHandler(async (req, res) => {
  // const id = req.params.id;
  // if (!id) {
  //   return res.status(400).json({ message: "pls Enter a valid" });
  // }

  try {
    const id = req.params.id;
    const subcatgeory = await SubCategory.findById(id);

    if (!subcatgeory) {
      return res.status(400).json({ message: "sub Category is not found" });
    }

    const status = !subcatgeory.status;

    const updateCategory = await SubCategory.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    if (!updateCategory) {
      return res.status(400).json({ message: "not bale to update" });
    }

    return res.status(201).json({
      message: `Catgeory item ${
        status ? "activate" : "deactivated"
      }successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sub catgeory item status" });
  }
});

// const getAllCategoriesWithSubcategories = asyncHandler(async (req, res) => {
//   try {
//     const categories = await Category.find({ status: true });

//     if (!categories || categories.length === 0) {
//       return res.status(400).json({ message: "No categories found" });
//     }

//     const result = [];

//     for (const category of categories) {
//       const subCategories = await SubCategory.find({
//         category: category._id,
//         status: true,
//       });

//       if (subCategories && subCategories.length > 0) {
//         result.push({
//           category: category,
//           subCategories: subCategories,
//         });
//       } else {
//         result.push({
//           category: category,
//           subCategories: [],
//         });
//       }
//     }

//     res.json(result);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error fetching categories" });
//   }
// });

const getAllCategoriesWithSubcategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({ status: true });

    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: "No categories found" });
    }

    const result = [];

    for (const category of categories) {
      const subCategories = await SubCategory.find({
        category: category._id,
        status: true,
      });

      if (subCategories && subCategories.length > 0) {
        result.push({
          category: category.title,
          subCategories: subCategories.map((sub) => sub.title),
        });
      } else {
        result.push({
          category: category.title,
          subCategories: [],
        });
      }
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching categories" });
  }
});

const getCategoriesWithSubcategoriesAndProducts = async (req, res) => {
  try {
    // Step 1: Fetch all categories with status true
    const categories = await Category.find({ status: true }).sort({
      createdAt: 1,
    });

    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: "No categories found" });
    }

    const result = [];

    for (const category of categories) {
      // Step 2: Fetch subcategories for each category
      const subCategories = await SubCategory.find({
        category: category._id,
        status: true,
      });

      const subCategoryDetails = [];

      for (const subCategory of subCategories) {
        // Step 3: Fetch products for each subcategory
        const products = await Puja.find({
          category: category._id,
          subCategory: subCategory._id,
          status: true,
        });

        subCategoryDetails.push({
          subCategory: subCategory.title,
          products: products.map((product) => ({
            title: product.title,
            price: product.price,
            description: product.description,
            image: product.image,
            CardpriceDisplay: product.CardpriceDisplay,
          })),
        });
      }

      result.push({
        category: category.title,
        subCategories: subCategoryDetails,
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching data" });
  }
};

//admin dropdown selection apis
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

module.exports = {
  getSubcategoriesByCategory,
  getCatgeories,
  createCategory,
  ToogleCategoryStatus,
  ToogleSubCategoryStatus,
  createSubcategory,
  getAllCategoriesWithSubcategories,
  getCategoriesWithSubcategoriesAndProducts,
};
