const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { validationResult } = require('express-validator');
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { name, description, quantity, categories } = req.body;
  
      const exists = await Product.findOne({ name });
      if (exists) {
        return res.status(400).json({ message: 'This Product is already added!' });
      }
  
      const validatedCategories = [];
      for (const id of categories) {
        const cat = await Category.findById(id);
        if (!cat) {
          return res.status(404).json({ message: `Category not found for ID: ${id}` });
        }
        validatedCategories.push({
          categorie_id: cat._id,
          categorie_name: cat.name
        });
      }
  
      const product = new Product({
        name,
        description,
        quantity,
        categories: validatedCategories
      });
  
      await product.save();
  
      return res.status(201).json({
        message: 'Product created successfully',
        data: product
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  };


  exports.list = async (req, res) => {
    try {
      const { page = 1, limit = 10, product_name, categoryFilter } = req.body;
  
      const filter = {};
  
      if (product_name) {
        filter.name = { $regex: new RegExp(product_name, "i") };
      }
  
      if (Array.isArray(categoryFilter) && categoryFilter.length > 0) {
        filter['categories.categorie_id'] = {
          $in: categoryFilter.map(id => new mongoose.Types.ObjectId(id))
        };
      }
      
      console.log(JSON.stringify(filter))
  
      const skip = (page - 1) * limit;
  
      const total = await Product.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);
  
      const products = await Product.find(filter)
        .populate({
          path: "categories",
          select: "name" // only fetch category name
        })
        .skip(skip)
        .limit(limit)
        .lean();
  
      return res.json({
        total,
        currentPage: parseInt(page),
        totalPages,
        products,
      });
    } catch (err) {
      console.error("Error in product list:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

  exports.deleteProduct = async (req, res) => {
    try {
      const _id = req.body?._id;
  
      if (!_id) {
        return res.status(400).json({ message: "Missing _id in request body" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid _id format" });
      }
  
      const deletedProduct = await Product.findByIdAndDelete(_id);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };
  
  
