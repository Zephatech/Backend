const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const app = express();
const authMiddleWare = require('./middleware/authMiddleware.js');
const authRoutes = require('./routes/auth.js');

// Middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors({
  exposedHeaders: 'set-cookie',
  credentials: true,
  origin: 'http://localhost:3000'
}));
// Error handling Middleware
app.use((err, req, res, next) => {
  console.log(err); // store error event to some lg file
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Routes
app.use('/auth', authRoutes);
app.get('/profile', authMiddleWare, (req, res) => {
  res.json({message: 'Profile Page'});
});
app.get('/', (req, res) => {
  res.json({message: 'ZHello World!'});
});


// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});