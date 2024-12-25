const asyncHandler = require("../middleware/asyncHandler");
const {
  Carosuel,
  validateCarousel,
} = require("../models/HomeBannerCarouselSchema");
const Puja = require("../models/pujadetailsSchema");
const {
  Category,
  SubCategory,
} = require("../models/categoryAndSubcategorySchema");

const createBanner = asyncHandler(async (req, res) => {
  // Validate carousel data
  // const { error } = validateCarousel(req.body);
  // if (error) {
  //   return res.status(400).json({ message: error.details[0].message });
  // }

  try {
    // Save carousel data to the database
    const carousel = new Carosuel({
      title: req.body.title,
      backgroundImage: req.file.filename,
      buttonType: req.body.buttonType,
      status: req.body.status,
    });
    if (!carousel) {
      return res.status(400).json({ message: "not able to add" });
    }

    await carousel.save();
    res.status(201).json(carousel);
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Error saving carousel data." });
  }
});

//get
const ClienthomeBannerGetApi = asyncHandler(async (req, res) => {
  try {
    const carosuels = await Carosuel.find({ status: true }).select("-status -__v -createdAt -updatedAt");

    if (!carosuels) {
      return res.status(404).json({ message: "No active carosules found" });
    }
    res.status(201).json({ banner: carosuels });
  } catch (err) {
    console.error(err);
    console.log(err);
    res.status(500).json({ error: "error retrieving active carousels" });
  }
});

//edit banner
const editHomeBannerData = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "please enter the valid id" });
  }

  try {
    const id = req.params.id;
    const carosuel = await Carosuel.findById(id);

    if (!carosuel) {
      return res.status(404).json({ message: "carosuel not found" });
    }

    const { error } = validateCarousel(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    if (req.file) {
      carosuel.backgroundImage = req.file.filename;
    }

    carosuel.title = req.body.title;
    carosuel.buttonType = req.body.buttonType;
    carosuel.status = req.body.status;

    await carosuel.save();

    return res.status(201).json({ message: "Carousel updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const ToggleStatusOfbanner = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const carosuel = await Carosuel.findById(id);

    if (!carosuel) {
      return res.status(404).json({ message: "Carsouel item not found" });
    }

    const status = !carosuel.status;

    const updateCarosuel = await Carosuel.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    return res.status(201).json({
      message: `Carsouel item ${
        status ? "activate" : "deactivated"
      }successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling carousel item status" });
  }
});

//category with product except first row,
const getallProductsWithCategory = asyncHandler(async (req, res) => {
  try {
    const catgeories = await Category.find({ status: true })
      .sort({ createdAt: 1 })
      .skip(1)
      .exec();

    if (!catgeories || catgeories.length === 0) {
      return res.status(400).json({ message: "No categories found" });
    }

    const result = [];

    for (const category of catgeories) {
      const puja = await SubCategory.find({
        category: category._id,
        status: true,
      });

      if (puja && puja.length > 0) {
        result.push({
          // category: category.map((data) => (data.title, data.smallDescription)),
          // category:category,
          category: {
            title: category.title,
            smallDescription: category.smallDescription,
          },
          puja: puja,
        });
      } else {
        result.push({
          category: {
            title: category.title,
            smallDescription: category.smallDescription,
          },
          puja: [],
        });
      }
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error fetching categories" });
  }
});

//category with product only first row.
const getProductsWithFirstCategory = asyncHandler(async (req, res) => {
  try {
    // Fetch the first category with status true
    const categories = await Category.find({ status: true })
      .sort({ createdAt: 1 })
      .limit(1);

    if (!categories || categories.length === 0) {
      return res.status(400).json({ message: "No categories found" });
    }

    // Store the first category in a separate variable
    const category = categories[0];

  
    const products = await Puja.find({
      category: category._id,
      status: true, 
    }).limit(4);

  
    return res.status(201).json({
      category: {
        title: category.title,
        smallDescription: category.smallDescription,
      },
      products: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching category and products" });
  }
});



const ActivateAcarouselItem = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "please enter the valid ID" });
  }
  try {
    const id = req.params.id;
    const carosuel = await Carosuel.findByIdAndUpdate(
      id,
      { status: true },
      { new: true }
    );

    if (carosuel)
      return res.status(201).json({ onActivationComplete: carosuel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error activating carousel item" });
  }
});

const DeactivateCarouselItem = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Please enter a valid ID" });
  }

  try {
    const id = req.params.id;
    const carosuel = await carosuel.findByIdAndUpdate(
      id,
      { status: false },
      {
        new: true,
      }
    );

    if (!carosuel) {
      return res.status(404).json({ message: "Carousel item not found" });
    }

    res.status(201).json({ message: "Error deactivating carosuel item" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deactivating carousel item" });
  }
});

module.exports = {
  ClienthomeBannerGetApi,
  ActivateAcarouselItem,
  DeactivateCarouselItem,
  ToggleStatusOfbanner,
  createBanner,
  editHomeBannerData,
  getallProductsWithCategory,
  getProductsWithFirstCategory,
};
