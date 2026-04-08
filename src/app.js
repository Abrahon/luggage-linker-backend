// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json()); // <-- This is required for req.body

// app.get("/", (req, res) => {
//   res.send("LuggageLinker API Running");
// });

// module.exports = app;

// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());

// // ✅ MUST HAVE BOTH
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.send("LuggageLinker API Running");
// });

// module.exports = app;

// src/app.js
const express = require("express");
const cors = require("cors");

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DEBUG BODY (optional, remove in production) ---
app.use((req, res, next) => {
  console.log("BODY DEBUG:", req.body);
  next();
});

// --- ROUTES ---
app.get("/", (req, res) => {
  res.send("LuggageLinker API Running");
});
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("🔥 ERROR STACK:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: err.stack || err,
  });
});

module.exports = app;
