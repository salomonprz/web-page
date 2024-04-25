const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "templates" directory
app.use(express.static(path.join(__dirname, 'templates')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve HTML files for specific routes
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'product-edit.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'products.html'));
});

app.get('/details', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'details.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'cart.html'));
});

// API for Product CRUD operations
app.get('/api/products', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'products.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading product data');
            return;
        }
        const products = data.trim().split('\n').map(line => {
            const parts = line.split(',');
            return { id: parts[0], name: parts[1], description: parts[2], category: parts[3], price: parts[4], imageUrl: parts[5] };
        });
        console.log(products); // Log the products array to debug
        res.json(products);
    });
});

app.post('/api/products', (req, res) => {
    const { name, description, category, price, imageUrl } = req.body; // Ensure imageUrl is retrieved from the request body
    const newProduct = `${Date.now()},${name},${description},${category},${price},${imageUrl}\n`; // Include imageUrl in the data string
    fs.appendFile(path.join(__dirname, 'data', 'products.txt'), newProduct, err => {
        if (err) {
            res.status(500).send('Error saving product');
            return;
        }
        res.send('Product added with image URL');
    });
});

// Update an existing product
app.put('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, category, price, imageUrl } = req.body;

    fs.readFile(path.join(__dirname, 'data', 'products.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading product data');
            return;
        }

        let products = data.split('\n');
        let productFound = false;
        const updatedData = products.map(product => {
            const parts = product.split(',');
            if (parts[0] === productId) {
                productFound = true;
                return `${productId},${name},${description},${category},${price},${imageUrl}`;
            }
            return product;
        }).join('\n');

        if (!productFound) {
            res.status(404).send('Product not found');
            return;
        }

        fs.writeFile(path.join(__dirname, 'data', 'products.txt'), updatedData, err => {
            if (err) {
                res.status(500).send('Error updating product');
                return;
            }
            res.send('Product updated successfully');
        });
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    fs.readFile(path.join(__dirname, 'data', 'products.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading product data');
            return;
        }
        const product = data.split('\n').find(p => p.split(',')[0] === productId);
        if (product) {
            const [id, name, description, category, price, imageUrl] = product.split(',');
            res.json({ id, name, description, category, price, imageUrl });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(path.join(__dirname, 'data', 'products.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading product data');
            return;
        }
        let products = data.trim().split('\n');
        const filteredProducts = products.filter(product => !product.startsWith(id + ',')).join('\n');

        fs.writeFile(path.join(__dirname, 'data', 'products.txt'), filteredProducts, err => {
            if (err) {
                res.status(500).send('Error deleting product');
                return;
            }
            res.send('Product deleted');
        });
    });
});

app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    fs.readFile(path.join(__dirname, 'data', 'products.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading product data');
            return;
        }
        const products = data.trim().split('\n');
        const product = products.find(p => p.split(',')[0] === productId);
        if (product) {
            const parts = product.split(',');
            res.json({ id: parts[0], name: parts[1], description: parts[2], category: parts[3], price: parts[4] });
        } else {
            res.status(404).send('Product not found');
        }
    });
});

// Get cart contents
app.get('/api/cart', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'cart.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading cart data');
            return;
        }
        const items = data.trim().split('\n').map(line => {
            const [productId, quantity] = line.split(',');
            return { productId, quantity };
        });
        res.json(items);
    });
});

// Add to cart
app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const cartItem = `${productId},${quantity}\n`;
    fs.appendFile(path.join(__dirname, 'data', 'cart.txt'), cartItem, err => {
        if (err) {
            res.status(500).send('Error adding to cart');
            return;
        }
        res.send('Item added to cart');
    });
});

// Remove from cart
app.delete('/api/cart/:productId', (req, res) => {
    const { productId } = req.params;
    fs.readFile(path.join(__dirname, 'data', 'cart.txt'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading cart data');
            return;
        }
        const newCartData = data.split('\n')
                                .filter(line => line.split(',')[0] !== productId)
                                .join('\n');
        fs.writeFile(path.join(__dirname, 'data', 'cart.txt'), newCartData, err => {
            if (err) {
                res.status(500).send('Error updating cart');
                return;
            }
            res.send('Item removed from cart');
        });
    });
});

// Checkout (clear the cart)
app.post('/api/cart/checkout', (req, res) => {
    fs.writeFile(path.join(__dirname, 'data', 'cart.txt'), '', err => {
        if (err) {
            res.status(500).send('Error during checkout');
            return;
        }
        res.send('Checkout successful, cart emptied');
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
