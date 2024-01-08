import express, { Router, Request, Response } from 'express'
import authMiddleware from '../middleware/authMiddleware'
import { getUserProfile, updateUserProfile, getOtherUserProfile } from '../controllers/profileController'

const router: Router = express.Router()
router.get('/getProfile', authMiddleware, getUserProfile)
router.put('/updateProfile', authMiddleware, updateUserProfile)
router.get('/getOtherUserProfile', authMiddleware, getOtherUserProfile)

export default router