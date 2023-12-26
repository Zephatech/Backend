import express, { Router, Request, Response } from 'express'
import {
  getAllProducts,
  getProductById,
  getProductsByUserId,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteAllProductsByUserId,
  generateTextForImage,
} from '../controllers/productController'
import authMiddleware from '../middleware/authMiddleware'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { imageToText } from '../utils/imageToText'

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/ryandeng/Documents/Coding/uw-trade/public/images') // Specify the directory to save the uploaded image
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = `${uuidv4()}${ext}`
    req.uuid = filename // Attach the UUID to the request object
    cb(null, filename)
  },
})

const upload = multer({ storage: storage })

const router: Router = express.Router()

router.get('/', getAllProducts)

router.get('/:id', getProductById)

router.get('/user/:userId', getProductsByUserId)

router.post(
  '/generateTextForImage',
  authMiddleware,
  upload.single('image'),
  generateTextForImage
)

router.post('/', authMiddleware, upload.single('image'), createProduct)

router.put('/:id', authMiddleware, upload.single('image'), updateProduct)

router.delete('/:id', authMiddleware, deleteProduct)

router.delete('/user/:userId', authMiddleware, deleteAllProductsByUserId)

export default router
