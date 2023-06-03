const authMiddleware = (req, res, next) => {
  // Authentication logic
  next();
};

module.exports = authMiddleware;



// Add middle ware to routes
// app.get('/profile', authMiddleware, (req, res) => {
//   // Handle authenticated user profile request
// });