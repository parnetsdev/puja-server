const Idohls = require("../models/Idohls.Schema");

// 1. Create a Product
const createProduct = async (req, res) => {
  try {
    const { title, description, textPrice1, textPrice2, price1, price2 } =
      req.body;

    // Get the filename of the uploaded image
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Create a new Idohls
    const newProduct = new Idohls({
      title,
      image,
      description,
      textPrice1,
      textPrice2,
      price1,
      price2,
      availability: true, 
    });

  
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Idohls created successfully", Idohls: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Idohls", error: error.message });
  }
};

// 2. Get All Products (GET with specific fields)
const getAllProducts = async (req, res) => {
  try {
    const products = await Idohls.find(
      { availability: true },
      "title image price1"
    ); // select specific fields
    res.status(200).json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
};

// 3. Get a Specific Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Idohls.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
};

// 4. Update a Product (PUT)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Idohls.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// 5. Delete a Product (DELETE)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Idohls.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
