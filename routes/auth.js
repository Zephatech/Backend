const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.get('/register', (req, res) => {
  const registrationForm = `
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
  `;
  console.log('register');
  res.send(registrationForm);
});
router.post('/register', authController.register);

router.get('/login', (req, res) => {
  const loginForm = `
    <h1>Login Form</h1>
    <form action="/auth/login" method="POST">
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required><br><br>
      <input type="submit" value="Login">
    </form>
  `;
  res.send(loginForm);
});
router.post('/login', authController.login);

module.exports = router;
