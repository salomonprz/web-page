const express = require('express');
const path = require('path');
const productController = require('./productController');

const app = express();
const PORT = process.env.PORT || 3000; // Set the port number

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'templates')));

// Define routes for API endpoints
app.get('/api/products', productController.getAllProducts);
app.get('/api/products/:id', productController.getProductById);
// Add more routes as needed for other endpoints

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
