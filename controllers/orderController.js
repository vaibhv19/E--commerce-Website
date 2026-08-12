import Order from '../models/Order.js';

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
export const placeOrder = async (req, res) => {
  const { items } = req.body;

  try {
    // 1. Input Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    // 2. Validate product IDs and quantities, fetch info, and calculate total
    let calculatedTotal = 0;
    const orderItems = [];

    // Map items to fetch requests in parallel
    const itemFetches = items.map(async (item) => {
      const { productId, quantity } = item;

      if (!productId || isNaN(productId)) {
        throw new Error(`Invalid product ID: ${productId}`);
      }

      const qty = parseInt(quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        throw new Error(`Invalid quantity for product ${productId}: must be a positive integer`);
      }

      // Fetch fresh details from DummyJSON to ensure correct pricing and description
      const response = await fetch(`https://dummyjson.com/products/${productId}`);
      if (!response.ok) {
        throw new Error(`Product ${productId} not found on server`);
      }

      const product = await response.json();
      
      const itemPrice = product.price;
      const itemTotal = itemPrice * qty;

      return {
        productId: product.id,
        title: product.title,
        price: itemPrice,
        quantity: qty,
        itemTotal
      };
    });

    try {
      const resolvedItems = await Promise.all(itemFetches);
      for (const resolvedItem of resolvedItems) {
        calculatedTotal += resolvedItem.itemTotal;
        
        // Remove itemTotal helper before saving schema
        const { itemTotal, ...schemaItem } = resolvedItem;
        orderItems.push(schemaItem);
      }
    } catch (fetchErr) {
      return res.status(400).json({ message: fetchErr.message });
    }

    // 3. Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      total: Number(calculatedTotal.toFixed(2)),
      status: 'placed'
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('placeOrder error:', error.message);
    return res.status(500).json({ message: 'Server error placing order' });
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error('getMyOrders error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving order history' });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ownership check
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied: You do not own this order' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('getOrderById error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    return res.status(500).json({ message: 'Server error retrieving order details' });
  }
};
