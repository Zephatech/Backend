const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const authMiddleWare = require('./middleware/authMiddleware.js');
const authRoutes = require('./routes/auth.js');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/profile', authMiddleWare, (req, res) => {
  res.send('Profile Page');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err); // store error event to some lg file
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});