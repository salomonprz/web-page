// Mock product data
const mockProducts = [
    { id: 1, name: 'Yeezy', description: 'Description 1', price: 10.99 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 19.99 },
    // Add more mock products as needed
];

// Method to get all products
exports.getAllProducts = (req, res) => {
    // Replace this with database query
    res.json(mockProducts);
};

// Method to get a product by ID
exports.getProductById = (req, res) => {
    const productId = req.params.id; // Change to req.params.id
    // Replace this with database query
    const product = mockProducts.find(product => product.id === parseInt(productId));
    res.json(product);
};

