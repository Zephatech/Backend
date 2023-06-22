import { Request, Response } from 'express';
import { Trade } from '../models/Trade';
import { User } from '../models/User';
import { Product } from '../models/Product';

export const createTrade = async (req: Request, res: Response) => {
  try {
    const buyerId = req.user.userId;
    const { productId } = req.body;

    const buyer = await User.findOne(buyerId);
    const product = await Product.findOne(productId);

    if (!buyer || !product) {
      return res.status(404).json({ message: 'User or product not found' });
    }

    if (product.locked) {
      return res.status(400).json({ message: 'Product is already locked for a trade' });
    }

    const owner = await User.findOne(product.ownerId);
    const trade = new Trade();
    trade.buyer = buyer;
    trade.seller = owner;
    trade.product = product;

    await trade.save();

    product.locked = true;
    product.lockedAt = new Date();
    await product.save();

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 确认交易
export const confirmTrade = async (req: Request, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const sellerId = req.user.userId;

    const trade = await Trade.findOne(tradeId, {
      where: { seller: sellerId },
      relations: ['product']
    });

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (trade.confirmed) {
      return res.status(400).json({ message: 'Trade is already confirmed' });
    }

    trade.confirmed = true;
    trade.confirmedAt = new Date();
    await trade.save();

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 取消交易
export const cancelTrade = async (req: Request, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const userId = req.user.userId;

    const trade = await Trade.findOne(tradeId, {
      where: [{ buyer: userId }, { seller: userId }],
      relations: ['product']
    });

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (trade.confirmed) {
      return res.status(400).json({ message: 'Cannot cancel a confirmed trade' });
    }

    trade.canceledAt = new Date();
    await trade.save();

    // 解锁产品
    trade.product.locked = false;
    trade.product.lockedAt = null;
    await trade.product.save();

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 结束交易
export const endTrade = async (req: Request, res: Response) => {
  try {
    const tradeId = req.params.tradeId;
    const userId = req.user.userId;

    const trade = await Trade.findOne(tradeId, {
      where: [{ buyer: userId }, { seller: userId }],
      relations: ['product']
    });

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    trade.endedAt = new Date();
    await trade.save();

    // 解锁产品
    trade.product.locked = false;
    trade.product.lockedAt = null;
    await trade.product.save();

    res.status(200).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};