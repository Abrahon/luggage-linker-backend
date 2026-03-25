// require("dotenv").config(); // load env vars
// const express = require("express");
// const app = express();
// const connectDB = require("./config/db");

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.json()); // parse JSON
// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

// // Routes
// app.use("/api/auth", require("./routes/auth.routes"));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();
const app = require("./app"); // import app instance
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

// Debug middleware — must be **after express.json() in app.js**
app.use((req, res, next) => {
  console.log(req.method, req.url, "body:", req.body);
  next();
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
