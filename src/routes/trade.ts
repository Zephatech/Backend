import express from 'express';
import { createTrade, cancelTrade, endTrade, acceptTrade } from '../controllers/tradeController';
import authMiddleware from '../middleware/authMiddleware';

const tradeRouter = express.Router();

// Create a trade
tradeRouter.post('/', authMiddleware, createTrade);

// Confirm a trade
tradeRouter.put('/:tradeId/confirm', authMiddleware, acceptTrade);

// Cancel a trade
tradeRouter.put('/:tradeId/cancel', authMiddleware, cancelTrade);

// End a trade
tradeRouter.put('/:tradeId/end', authMiddleware, endTrade);

export default tradeRouter;