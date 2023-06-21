const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  try {
    // Check if user already exists
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'The email is registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate email verification token
    const token = jwt.sign({ email }, 'uwaterlootradesecret');

    // Store user in the database
    await User.create(firstName, lastName, email, hashedPassword, token, false);

    res.cookie('jwt', token, {
      httpOnly: true, 
    })
    res.status(200).json({ message: 'Registration successful. Please check your email for verification.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findByEmail(email);
    if (user === null) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Wrong Password' });
    }

    // Generate JWT with expiration time
    const expiresIn = '7d'; // Token expier in a week
    const secretKey = 'uwaterlootradesecret'; 
    const token = jwt.sign({ email }, secretKey, { expiresIn });
    res.cookie('jwt', token, {
      httpOnly: true, 
    })
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', "", {
    httpOnly: true, 
  });  
  res.status(200).json({ message: 'Logout successful' });
}