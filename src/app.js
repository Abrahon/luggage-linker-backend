const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json()); // <-- This is required for req.body

app.get("/", (req, res) => {
  res.send("LuggageLinker API Running");
});

module.exports = app;
