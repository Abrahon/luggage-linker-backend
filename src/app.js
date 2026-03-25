const express = require("express");
const cors = require("cors");

const app = express();

const dashboardRoutes = require("./routes/dashboard.routes");
app.use(cors());
app.use(express.json()); // <-- This is required for req.body

app.get("/", (req, res) => {
  res.send("LuggageLinker API Running");
});
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
