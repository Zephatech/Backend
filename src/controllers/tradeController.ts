import { Request, Response } from 'express';
import User from '../models/UserModel';
import Product from '../models/ProductModel';
import Trade from '../models/TradeModel';
import { User as UserEntity } from '../entity/User';
import { Product as ProductEntity } from '../entity/Product';
import { Trade as TradeEntity } from '../entity/Trade';
import myDataSource from '../config/dataSource';
import { AuthenticatedRequest } from '../types/authenticatedRequest';

export const createTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const buyerId: number = req.user.userId;
    const { productId } = req.body;

    const buyer: UserEntity = await User.findById(buyerId);
    const product: ProductEntity = await Product.findById(productId);
    const tradeRecord: Trade[] = await Trade.findByBuyerSellerProductId(buyerId, product.ownerId, productId);

    if(tradeRecord.length > 0) {
      return res.status(400).json({ message: 'Trade already exists' });
    }
    
    if (!buyer || !product) {
      return res.status(404).json({ message: 'buyer or product not found' });
    }

    if (product.isSold == true) {
      return res.status(404).json({ message: 'product has been already sold'})
    }

    const owner: UserEntity = await User.findById(product.ownerId);
    if (!owner) {
      return res.status(404).json({ message: 'owner not found' });
    }

    const trade = await Trade.create(buyer, owner, product);
    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const sellerId = req.user.userId;

    const trade: TradeEntity = await Trade.findById(tradeId);
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    } else if (trade.confirmed) {
      return res.status(400).json({ message: 'Trade is already confirmed' });
    } if (trade.product.ownerId !== sellerId) {
      return res.status(403).json({ message: 'Unauthorized to confirm this trade' });
    }

    const product = trade.product;

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!trade.canceledAt == null) {
      return res.status(400).json({ message: 'Cannot confirm a canceled trade' });
    }

    trade.confirmed = true;
    trade.confirmedAt = new Date();
    product.locked = true;
    product.lockedAt = new Date();

    await myDataSource.manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(trade);
      await transactionalEntityManager.save(product);
    });

    res.status(200).json({trade});
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

    if (trade.buyer. id !== req.user.userId && trade.seller.id !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this trade' });
    }

    trade.canceledAt = new Date();
    trade.confirmed = false;
    trade.confirmedAt = null;
    trade.product.locked = false;
    trade.product.lockedAt = null;
    
    await myDataSource.manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(trade.product);
      await transactionalEntityManager.remove(trade);
    });

    res.status(200).json({trade});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const endTrade = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const currUserId= req.user.userId;

    const trade = await Trade.findById(tradeId);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    } else if (!trade.confirmed) {
      return res.status(400).json({ message: 'Cannot end an unconfirmed trade' });
    } else if (currUserId !== trade.buyer.id) {
      return res.status(403).json({ message: 'Unauthorized to end this trade (Only Buyer can end the trade)' });
    }

    trade.endedAt = new Date();
    trade.product.isSold = true;
    await myDataSource.manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(trade);
      await transactionalEntityManager.save(trade.product)
    });

    res.status(200).json({trade});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTradeRecord =async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const tradeRecordAsBuyer = await Trade.findByBuyerId(userId);
    const tradeRecordAsSeller = await Trade.findBySellerId(userId);
  
    res.status(200).json({ buy: tradeRecordAsBuyer, sell: tradeRecordAsSeller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getTradeById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const trade = await Trade.findById(tradeId);
    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}