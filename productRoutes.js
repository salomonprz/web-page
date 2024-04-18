const express = require('express');
const path = require('path');
const productRoutes = require('./productRoutes');

const app = express();
const PORT = process.env.PORT || 3000; // Set the port number

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use product routes
app.use('/api', productRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
