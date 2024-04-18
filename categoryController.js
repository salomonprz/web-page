// Mock category data
const mockCategories = [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
    // Add more mock categories as needed
  ];
  
  // Method to get all categories
  exports.getCategories = (req, res) => {
    // Replace this with database query
    res.json(mockCategories);
  };
  
  // Method to get a category by ID
  exports.getCategoryById = (req, res) => {
    const categoryId = req.params.categoryId;
    // Replace this with database query
    const category = mockCategories.find(category => category.id === parseInt(categoryId));
    res.json(category);
  };
  