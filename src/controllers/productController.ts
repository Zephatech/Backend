import { Request, Response } from 'express'
import Product from '../models/ProductModel'
import {
  AuthenticatedRequest,
  PostItemRequest,
} from '../types/authenticatedRequest'
import { isContentToxic } from '../utils/sensitiveTextChecker'
import { isImageToxic } from '../utils/sensitiveImageChecker'
import { imageToText } from '../utils/imageToText'

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let products = await Product.findAll()
    products = products.filter((product) => !product.isSold && !product.locked)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProductsBySearchTerm = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.params.searchTerm
    const products = await Product.findAll()

    if (searchTerm === '') {
      return res.status(200).json(products)
    }

    const filteredProducts = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })

    res.status(200).json(filteredProducts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
    }
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProductsByUserId = async (req: Request, res: Response) => {
  try {
    const products = await Product.findByUserId(req.params.userId)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMyListing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const products = await Product.findByUserId(req.user.userId)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createProduct = async (req: PostItemRequest, res: Response) => {
  try {
    const ownerId = req.user.userId
    const { name, price, description, category } = req.body
    if ((await isContentToxic(name)) || (await isContentToxic(description))) {
      return res.status(400).json({
        message: 'Product name or description contains sensitive text',
      })
    }

    const image = req.file ? req.uuid : ''
    if (req.file && (await isImageToxic(image))) {
      return res
        .status(400)
        .json({ message: 'Product image contains sensitive content' })
    }
    const product = await Product.create(
      ownerId,
      name,
      price,
      description,
      category,
      image
    )
    res.status(200).json({ product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProduct = async (req: PostItemRequest, res: Response) => {
  try {
    const productId = req.params.id
    const ownerId = req.user.userId
    const { name, price, description, category } = req.body

    if ((await isContentToxic(name)) || (await isContentToxic(description))) {
      return res.status(400).json({
        message: 'Product name or description contains sensitive text',
      })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.ownerId !== ownerId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to update this product' })
    }

    if (product.locked) {
      return res.status(403).json({
        message:
          'Product is locked, there is a comfirmed trade for this product, please cancel if you want to change the product',
      })
    }
    const image = req.file ? req.uuid : ''
    const updatedProduct = await Product.update(
      productId,
      name,
      price,
      description,
      category,
      image
    )
    res.status(200).json({ product: updatedProduct })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteProduct = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const productId = req.params.id
  const ownerId = req.user.userId

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (product.ownerId !== ownerId) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to delete this product' })
    }

    const deletedProduct = await Product.delete(productId)
    res.status(200).json({ deletedProduct })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteAllProductsByUserId = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const ownerId = req.user.userId

  try {
    const userId = parseInt(req.params.userId)

    if (ownerId !== userId) {
      return res.status(403).json({
        message: 'Unauthorized to delete products of this user',
      })
    }

    const products = await Product.deleteAllByUserId(userId)
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const generateTextForImage = async (
  req: PostItemRequest,
  res: Response
) => {
  try {
    let image = req.file ? req.uuid : ''
    console.log('+++++++++++')
    console.log(image)
    if (req.file && (await isImageToxic(image))) {
      return res
        .status(400)
        .json({ message: 'Product image contains sensitive content' })
    }
    const result = await imageToText(image)
    res.status(200).json({ result })

    // res.status(200).json(null);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
