

// // src/server.js
// require("dotenv").config();
// const app = require("./app");
// const connectDB = require("./config/db");

// // --- CONNECT TO MONGODB ---
// connectDB()
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => {
//     console.error("MongoDB Connection Error:", err);
//     process.exit(1);
//   });

// // --- START SERVER ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// CONNECT DB FIRST
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});