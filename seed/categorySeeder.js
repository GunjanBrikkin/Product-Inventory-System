const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const connectDB = require('../config/db');

// this following is my script for categories bulk creation in DB

const seedCategories = async () => {
  await connectDB();
  const categories = ['Electronics', 'Groceries', 'Books', 'Fashion'];

  await Category.deleteMany();
  await Category.insertMany(categories.map(name => ({ name })));

  console.log('Categories Seeded');
  process.exit();
};

seedCategories();
