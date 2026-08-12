import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: [true, 'Product ID is required']
  },
  title: {
    type: String,
    required: [true, 'Product title is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['placed'],
    default: 'placed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
