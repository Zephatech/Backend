import express, { Router, Request, Response } from 'express'
import authMiddleware from '../middleware/authMiddleware'
import { updateUserProfile } from '../controllers/profileController'
import { AuthenticatedRequest } from '../types/authenticatedRequest'
import { User } from '../entity/User'

const router: Router = express.Router()
router.put('/updateProfile', authMiddleware, updateUserProfile)
router.get('/getUserProfile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.userId)
        if (!user) {
        return res.status(404).json({ message: 'User not found' })
        }
        
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            facebookProfile: user.facebookProfile,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    }
)

export default router