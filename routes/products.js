import express from 'express';
import {
  getProducts,
  getCategories,
  getProductsByCategory,
  getProductById
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;
