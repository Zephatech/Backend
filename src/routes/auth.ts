import express, { Router, Request, Response } from 'express'
import {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  logout,
  resetPassword,
  getCurrentUserIdAndName
} from '../controllers/authController'
import authMiddleware from '../middleware/authMiddleware'

const router: Router = express.Router()
router.post('/register', register)
router.post('/verifyEmail', verifyEmail)
router.post('/resendVerificationCode', resendVerificationCode)
router.post('/resetPassword', resetPassword)
router.post('/login', login)
router.get('/logout', logout)
router.get('/getCurrentUserId',authMiddleware,getCurrentUserIdAndName)

// TODO: remove these routes (After building up testing)
router.get('/register', (req: Request, res: Response) => {
  const registrationForm: string = `
    <h1>Registration Form</h1>
    <form action="/auth/register" method="POST">
      <label for="firstName">First Name:</label>
      <input type="text" id="firstName" name="firstName" required><br><br>

      <label for="lastName">Last Name:</label>
      <input type="text" id="lastName" name="lastName" required><br><br>

      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>

      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>

      <input type="submit" value="Register">
    </form>
  `
  console.log('register')
  res.send(registrationForm)
})

router.get('/verifyEmail', (req: Request, res: Response) => {
  const verifyEmailForm: string = `
    <h1>Verify Email Form</h1>
    <form action="/auth/verifyEmail" method="POST">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>
      <label for="verificationCode">Verification Code:</label>
      <input type="text" id="verificationCode" name="verificationCode" required><br><br>
      <input type="submit" value="Verify">
    </form>
  `
  res.send(verifyEmailForm)
})

router.get('/login', (req: Request, res: Response) => {
  const loginForm: string = `
    <h1>Login Form</h1>
    <form action="/auth/login" method="POST">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>
      <input type="submit" value="Login">
    </form>
  `
  res.send(loginForm)
})

router.get('/resetPassword', (req: Request, res: Response) => {
  const resetPasswordForm: string = `
    <h1>Reset Password Form</h1>
    <form action="/auth/resetPassword" method="POST">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>
      <label for="verificationCode">Verification Code:</label>
      <input type="text" id="verificationCode" name="verificationCode" required><br><br>
      <label for="newPassword">New Password:</label>
      <input type="password" id="newPassword" name="newPassword" required><br><br>
      <input type="submit" value="Reset Password">
    </form>
  `
  res.send(resetPasswordForm)
})

router.get('/resentVerificationCode', (req: Request, res: Response) => {
  const resendVerificationCodeForm: string = `
    <h1>Resend Verification Code Form</h1>
    <form action="/auth/resendVerificationCode" method="POST">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>
      <input type="submit" value="Resend Verification Code">
    </form>
  `
  res.send(resendVerificationCodeForm)
})

export default router
