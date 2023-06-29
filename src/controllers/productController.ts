import { Request, Response } from 'express';
import Product from '../models/ProductModel';
import { AuthenticatedRequest, PostItemRequest } from '../types/authenticatedRequest';
import { isContentToxic } from '../utils/sensitiveTextChecker';


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId);
    if(!product){
      res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getProductsByUserId = async (req: Request, res: Response) => {
  try {
    const products = await Product.findByUserId(req.params.userId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const createProduct = async (req: PostItemRequest, res: Response) => {
  try {
    const ownerId = req.user.userId;    
  
    const { name, price, description, category } = req.body;
    if(isContentToxic (name) || isContentToxic (description)){
      return res.status(400).json({ message: 'Product name or description contains sensitive text' });
    }
    const image = req.file ? req.uuid : ""
    const product = await Product.create(ownerId, name, price, description, category, image);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const productId = req.params.id;
    const ownerId = req.user.userId;
    const { name, price, description, category, image } = req.body;
    
    if(isContentToxic (name) || isContentToxic (description)){
      return res.status(400).json({ message: 'Product name or description contains sensitive text' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to update this product' });
    }
    
    const updatedProduct = await Product.update(productId, name, price, description, category, image);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  const productId = req.params.id;
  const ownerId = req.user.userId;
  
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.ownerId !== ownerId) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }
    
    const deletedProduct = await Product.delete(productId);
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAllProductsByUserId = async (req: AuthenticatedRequest, res: Response) => {
  const ownerId = req.user.userId; 
  
  try {
    const userId = parseInt(req.params.userId);

    if (ownerId !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete products of this user' });
    }
    
    const products = await Product.deleteAllByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};