import { Request, Response } from 'express';
import User from '../models/UserModel';
import Product from '../models/ProductModel';
import Trade from '../models/TradeModel';
import myDataSource from '../config/dataSource';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

export const createTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId = req.user.userId;
    const { productId } = req.body;

    const buyer = await User.findById(buyerId);
    const product = await Product.findById(productId);

    if (!buyer || !product) {
      return res.status(404).json({ message: 'User or product not found' });
    }

    if (product.locked) {
      return res.status(400).json({ message: 'Product is already locked for a trade' });
    }

    const owner = await User.findById(product.ownerId);

    const trade = Trade.create(buyer, owner, product);
    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const confirmTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const sellerId = req.user.userId;

    const trade = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    } else if (trade.confirmed) {
      return res.status(400).json({ message: 'Trade is already confirmed' });
    }

    const product = await Product.findById(trade.product.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    trade.confirmed = true;
    trade.confirmedAt = new Date();
    product.locked = true;
    product.lockedAt = new Date();

    await myDataSource.manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(trade);
      await transactionalEntityManager.save(product);
    });

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const cancelTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tradeId = req.params.tradeId;

    const trade = await Trade.findById(tradeId)

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (trade.confirmed) {
      return res.status(400).json({ message: 'Cannot cancel a confirmed trade' });
    }

    trade.canceledAt = new Date();
    trade.product.locked = false;
    trade.product.lockedAt = null;
    
    await myDataSource.manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(trade);
      await transactionalEntityManager.save(trade.product);
    });

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const endTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const userId = req.user.userId;

    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    trade.endedAt = new Date();
    trade.product.locked = false;
    trade.product.lockedAt = null;

    await myDataSource.manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(trade);
      await transactionalEntityManager.save(trade.product);
    });

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

