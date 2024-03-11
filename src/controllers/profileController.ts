import { Response } from 'express'
import { AuthenticatedRequest } from '../types/authenticatedRequest'
import User from '../models/UserModel'

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
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
            bio: user.bio,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            facebook,
            bio
        } = req.body

        const userId = req.user.userId
        const updatedUser = await User.updateUser(
            userId,
            firstName,
            lastName,
            phone,
            facebook,
            bio
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getOtherUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            facebookProfile: user.facebookProfile,
            bio: user.bio,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}