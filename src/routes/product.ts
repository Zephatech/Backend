import express, { Router, Request, Response } from 'express'
import {
  getAllProducts,
  getProductById,
  getProductsByUserId,
  getMyListing,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProductsByUserId,
  generateTextForImage,
  getSimilarProducts,
} from '../controllers/productController'
import authMiddleware from '../middleware/authMiddleware'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { imageToText } from '../utils/imageToText'

const formDataParser = multer().none(); // This middleware will parse formData

const router: Router = express.Router()

router.get('/', getAllProducts)

router.get('/myListings', authMiddleware, getMyListing)

router.get("/getSimilarProducts/:id", getSimilarProducts)

router.get('/user/:userId', getProductsByUserId)

router.get('/:id', getProductById)

// router.post(
//   '/generateTextForImage',
//   authMiddleware,
//   upload.single('image'),
//   generateTextForImage
// )

// router.post('/', authMiddleware, upload.single('image'), createProduct)
router.post('/', authMiddleware, formDataParser, createProduct)
//

// router.put('/:id', authMiddleware, upload.single('image'), updateProduct)
router.put('/:id', authMiddleware, formDataParser, updateProduct)

router.delete('/:id', authMiddleware, deleteProduct)

router.delete('/user/:userId', authMiddleware, deleteAllProductsByUserId)

export default router
