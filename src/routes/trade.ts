import express from 'express';
import { createTrade, confirmTrade, cancelTrade, endTrade } from '../controllers/tradeController';
import authMiddleware from '../middleware/authMiddleware';

const tradeRouter = express.Router();

// Create a trade
tradeRouter.post('/', authMiddleware, createTrade);

// Confirm a trade
tradeRouter.put('/:tradeId/confirm', authMiddleware, confirmTrade);

// Cancel a trade
tradeRouter.put('/:tradeId/cancel', authMiddleware, cancelTrade);

// End a trade
tradeRouter.put('/:tradeId/end', authMiddleware, endTrade);

export default tradeRouter;