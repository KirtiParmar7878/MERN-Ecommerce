import Product from "../models/productModel.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).send({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting products",
      error,
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).send({
      success: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting products by category",
      error,
    });
  }
};

// Get single product
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting product",
      error,
    });
  }
};

// Create product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const product = new Product({ name, description, price, category, stock });
    await product.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating product",
      error,
    });
  }
};