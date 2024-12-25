const asyncHandler = require("../middleware/asyncHandler");
const Puja = require("../models/pujadetailsSchema");
const {
  Category,
  SubCategory,
} = require("../models/categoryAndSubcategorySchema");

const pujaDetailsCreate = asyncHandler(async (req, res) => {
  const { title, description, homamOptions, pujaDetails } = req.body;

  if (!title || !description || !homamOptions || !pujaDetails) {
    return res
      .status(400)
      .json({ message: "please Provide all required fields" });
  }

  if (!Array.isArray(homamOptions) || homamOptions.length === 0) {
    return res
      .status(400)
      .json({ message: "please provide at least one homam" });
  }

  if (
    !pujaDetails ||
    !pujaDetails.availableDates ||
    !pujaDetails.name ||
    !pujaDetails.nakshatra ||
    !pujaDetails.rasi
  ) {
    return res.status(400).json({ error: "please enter the all the fields" });
  }

  if (
    !Array.isArray(pujaDetails.availableDates) ||
    pujaDetails.availableDates.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "please Provide at least one avaiable date" });
  }

  const puja = new Puja({
    title: req.body.title,
    description: req.body.description,
    CardpriceDisplay: req.body.CardpriceDisplay,
    homamOptions: req.body.homamOptions,
    pujaDetails: {
      availableDates: req.body.pujaDetails.availableDates,
      name: req.body.pujaDetails.name,
      name: req.body.pujaDetails.name,
      nakshatra: req.body.pujaDetails.nakshatra,
      rasi: req.body.pujaDetails.nakshatra,
      additionalInfo: req.body.pujaDetails.additionalInfo,
    },
    category: req.body.category,
    subCategory: req.body.subCategory,
  });

  try {
    const createdPuja = await puja.save();

    return res
      .status(201)
      .json({ message: "Puja created successfully", data: createdPuja });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create Puja", error: error.message });
  }
});

// const updatePuja = async (req, res) => {
//   try {
//     const { id } = req.params; // ID of the Puja document to update
//     const updateData = req.body; // Data to update

//     // Validate if ID is provided
//     if (!id) {
//       return res.status(400).json({ message: "Puja ID is required" });
//     }

//     // Validate if the body is not empty
//     if (!Object.keys(updateData).length) {
//       return res.status(400).json({ message: "No fields provided to update" });
//     }

//     // Automatically update the `updatedAt` field
//     updateData.updatedAt = Date.now();

//     // Find and update the document
//     const updatedPuja = await Puja.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true } // `new: true` returns the updated document, `runValidators` ensures schema validation
//     );

//     if (!updatedPuja) {
//       return res.status(404).json({ message: "Puja not found" });
//     }

//     res.status(200).json({ message: "Puja updated successfully", data: updatedPuja });
//   } catch (error) {
//     console.error("Error updating Puja:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

const path = require("path"); // For handling file paths
const fs = require("fs"); // For file system operations

const updatePuja = async (req, res) => {
  try {
    const { id } = req.params; // ID of the Puja document to update
    const updateData = req.body; // Other fields to update

    // Validate if ID is provided
    if (!id) {
      return res.status(400).json({ message: "Puja ID is required" });
    }

    // Check if a file is uploaded
    if (req.file) {
      const imagePath = `${req.file.filename}`; // File path of the new image

    
      updateData.image = imagePath;

      // Optional: Remove the old image file if it exists
      const puja = await Puja.findById(id);
      if (
        puja &&
        puja.image &&
        puja.image !== "uploads/default/product-placeholder.png"
      ) {
        const oldImagePath = path.resolve(puja.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err);
          }
        });
      }
    }

    // Automatically update the `updatedAt` field
    updateData.updatedAt = Date.now();

    // Update the document in the database
    const updatedPuja = await Puja.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedPuja) {
      return res.status(404).json({ message: "Puja not found" });
    }

    res
      .status(200)
      .json({ message: "Puja updated successfully", data: updatedPuja });
  } catch (error) {
    console.error("Error updating Puja:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const TooglePujaStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: "pls Enter a valid" });
  }

  try {
    const id = req.params.id;
    const puja = await Puja.findById(id);

    if (!puja) {
      return res.status(400).json({ message: "Category is not found" });
    }

    const status = !puja.status;

    const updatePuja = await Puja.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
      }
    );

    if (!updatePuja) {
      return res.status(400).json({ message: "not able to update" });
    }

    return res.status(201).json({
      message: `Puja item ${status ? "activate" : "deactivated"}successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling Puja item status" });
  }
});

module.exports = { pujaDetailsCreate, TooglePujaStatus, updatePuja };
