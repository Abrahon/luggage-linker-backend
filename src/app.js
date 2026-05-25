
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
app.use("/api/auth", require("./routes/auth.routes"));
console.log("🔵 AUTH ROUTE REGISTERED");
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/trip", require("./routes/trip.routes"));
app.use("/api/booking", require("./routes/booking.routes"));
app.use("/api/membership", require("./routes/membership.routes"));
// app.use("/api/payment", require("./routes/payment.routes"));
// app.use("/api/notification", require("./routes/notification.routes"));


// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("🔥 ERROR STACK:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: err.stack || err,
  });
});

module.exports = app;

