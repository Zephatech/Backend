import express, { Router, Request, Response } from 'express';
import { getAllProducts, getProductById, getProductsByUserId, createProduct, updateProduct, deleteProduct, deleteAllProductsByUserId } from '../controllers/productController';
import authMiddleware from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.get('/user/:userId', getProductsByUserId);

router.post('/', authMiddleware, createProduct);

router.put('/:id', authMiddleware, updateProduct);

router.delete('/:id', authMiddleware, deleteProduct);

router.delete('/user/:userId', authMiddleware, deleteAllProductsByUserId);

export default router;