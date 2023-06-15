const express = require("express");
const app = express();

// // Middleware
// app.use(express.json()); // Parse JSON request bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// // Custom middleware
// app.use((req, res, next) => {
//   // Custom middleware logic
//   next();
// });

// // Routes
// const authRoutes = require('./routes/auth');
// const marketplaceRoutes = require('./routes/marketplace');
// const tradeRoutes = require('./routes/trade');

// app.use('/auth', authRoutes);
// app.use('/marketplace', marketplaceRoutes);
// app.use('/trade', tradeRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   // Error handling logic
//   res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
// });

// testing purposes
app.get("/", (req, res) => {
  res.send("hello world");
});

const productRouter = require("./routes/product");
app.use("/users", productRouter);

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
