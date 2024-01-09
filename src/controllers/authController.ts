import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/UserModel'
import { transporter } from '../config/mail'
import { enable_mail_sender } from '../featureFlags'
import { AuthenticatedRequest } from '../types/authenticatedRequest'

// Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit and 1 special character
function isValidPassword(password) {
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/
  return passwordRegex.test(password)
}

// Make sure the email is a valid UW email
function isValidUWEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const domain = email.split('@')[1]
  return emailRegex.test(email) && domain === 'uwaterloo.ca'
}

async function sendVerificationCodeToEmail(email, verificationCode) {
  const mailOptions = {
    from: 'no-reply@uwtrade.com', // Add your sender email address here
    to: email,
    subject: 'UWaterloo Trade Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 20px;">
        <h1 style="text-align: center; color: #007BFF;">UWaterloo Trade Verification</h1>
        <p style="text-align: center;">Dear User,</p>
        <p style="text-align: center;">Your verification code is:</p>
        <div style="text-align: center; background-color: #007BFF; color: white; padding: 10px; font-size: 24px; margin: 10px auto; width: 150px;">
          ${verificationCode}
        </div>
        <p style="text-align: center;">Please enter this code <a href="http://localhost:3000/verify-email?email=${email}">here</a> to complete the verification process.</p>
        <p style="text-align: center;">Thank you for using our service!</p>
      </div>
    `,
  }

  if (enable_mail_sender) {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        throw error
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
  }
}

function generateVerificationCode() {
  const length = 6
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    code += characters[randomIndex]
  }

  return code
}

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body
  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ message: 'Password does not meet the criteria' })
  }
  if (!isValidUWEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  try {
    // Check if user already exists
    const userExists = await User.findByEmail(email)
    if (userExists) {
      return res.status(400).json({ message: 'The email is registered' })
    }

    // Generate verification code
    const verificationCode = generateVerificationCode() // Generate a random verification code

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Generate email verification token
    const token = jwt.sign({ email }, 'uwaterlootradesecret')

    // Store user in the database
    await User.create(
      firstName,
      lastName,
      email,
      hashedPassword,
      false,
      verificationCode
    )
    console.log(verificationCode)

    await sendVerificationCodeToEmail(email, verificationCode) // Implement this function to send verification code to user's email

    res.cookie('jwt', token, {
      httpOnly: true,
    })
    res.status(200).json({
      message:
        'Registration successful. Please check your email for verification.',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, verificationCode } = req.body

  try {
    // Find user by email
    const user = await User.findByEmail(email)
    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the verification code matches
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    // Mark user's email as verified
    await User.markEmailAsVerified(email)

    // Generate JWT with expiration time
    const expiresIn = '7d' // Token expires in a week
    const secretKey = 'uwaterlootradesecret'
    const userId = user.id
    const token = jwt.sign({ email, userId }, secretKey, { expiresIn })
    res.cookie('jwt', token, {
      httpOnly: true,
    })

    res.status(200).json({ message: 'Email verification successful' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Can be used for register verification and password reset
export const resendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body
  try {
    // Find user by email
    const user = await User.findByEmail(email)
    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Generate verification code
    const verificationCode = generateVerificationCode() // Generate a random verification code

    // Update user's verification code
    user.verificationCode = verificationCode
    await User.updateverificationCode(email, verificationCode)

    sendVerificationCodeToEmail(email, verificationCode) // Implement this function to send verification code to user's email
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  const { email, verificationCode, newPassword } = req.body
  if (!isValidPassword(newPassword)) {
    return res
      .status(400)
      .json({ message: 'Password does not meet the criteria' })
  }

  try {
    // Find user by email
    const user = await User.findByEmail(email)
    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the verification code matches
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user's password
    await User.updatePassword(email, hashedPassword)

    res.status(200).json({ message: 'Password reset successful' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await User.findByEmail(email)
    if (user === null) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Wrong Password' })
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(401).json({ message: 'Email is not verified' })
    }

    // Generate JWT with expiration time
    const expiresIn = '7d' // Token expires in a week
    const secretKey = 'uwaterlootradesecret'
    const userId = user.id
    const token = jwt.sign({ email, userId }, secretKey, { expiresIn })
    res.cookie('jwt', token, {
      httpOnly: true,
    })
    res.status(200).json({ message: 'Login successful' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const logout = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
  })
  res.status(200).json({ message: 'Logout successful' })
}

export const getCurrentUserIdAndName = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId)
    res.status(200).json({ userId: req.user.userId, name: user?.firstName })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}