// @desc    Get all products (supports filtering, search, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, limit = 12, skip = 0 } = req.query;

    const parsedLimit = parseInt(limit, 10);
    const parsedSkip = parseInt(skip, 10);

    let url = 'https://dummyjson.com/products';

    if (category) {
      url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}`;
    } else if (search) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}`;
    }

    // Append limit and skip
    const delimiter = url.includes('?') ? '&' : '?';
    url = `${url}${delimiter}limit=${parsedLimit}&skip=${parsedSkip}`;

    console.log(`Proxying request to: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching products from external source' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('getProducts error:', error.message);
    return res.status(500).json({ message: 'Server error fetching products proxy' });
  }
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const url = 'https://dummyjson.com/products/categories';
    console.log(`Proxying request to: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching categories from external source' });
    }

    const data = await response.json();
    // DummyJSON returns array of category objects or strings. Let's make sure it handles both.
    // In newer dummyjson versions, categories is an array of objects: { slug, name, url } or strings.
    // We just return it directly.
    return res.status(200).json(data);
  } catch (error) {
    console.error('getCategories error:', error.message);
    return res.status(500).json({ message: 'Server error fetching categories' });
  }
};

// @desc    Get products by category path parameters (optional route fallback)
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12, skip = 0 } = req.query;

    const parsedLimit = parseInt(limit, 10);
    const parsedSkip = parseInt(skip, 10);

    const url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${parsedLimit}&skip=${parsedSkip}`;
    console.log(`Proxying category request to: ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching products by category' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('getProductsByCategory error:', error.message);
    return res.status(500).json({ message: 'Server error fetching products by category' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid number (DummyJSON uses numeric IDs)
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const url = `https://dummyjson.com/products/${id}`;
    console.log(`Proxying request to: ${url}`);

    const response = await fetch(url);
    if (response.status === 404) {
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }
    
    if (!response.ok) {
      return res.status(response.status).json({ message: 'Error fetching product from external source' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('getProductById error:', error.message);
    return res.status(500).json({ message: 'Server error fetching product details' });
  }
};
