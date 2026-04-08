// src/scripts/debugLogin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model"); // make sure path is correct

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected");

  const users = await User.find();
  console.log("All Users:", users);

  // Example: check password for a user
  const email = "admin@gmail.com"; // change to test user email
  const password = "Sujon123@#";   // change to test password

  const user = await User.findOne({ email });
  if (!user) return console.log("User not found");

  const match = await bcrypt.compare(password, user.password);
  console.log("Password match:", match);
  console.log("isVerified:", user.isVerified);

  process.exit();
}

main();