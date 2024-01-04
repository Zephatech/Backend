import { Response } from 'express'
import { AuthenticatedRequest } from '../types/authenticatedRequest'
import User from '../models/UserModel'

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            firstName,
            lastName,
            phone,
            facebook,
        } = req.body

        const userId = req.user.userId
        const updatedUser = await User.updateUser(
            userId,
            firstName,
            lastName,
            phone,
            facebook,
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
