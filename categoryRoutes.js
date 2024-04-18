const express = require('express');
const router = express.Router();
const categoryController = require('./controllers/categoryController');

// Route to get all categories
router.get('/categories', categoryController.getCategories);

// Route to get a category by ID
router.get('/categories/:categoryId', categoryController.getCategoryById);

module.exports = router;
