require("dotenv").config();
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const User = require("../models/user.model");

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "admin1@gmail.com";
    const password = "Admin123@#";

    const existing = await User.findOne({ email });

    if (existing) {
      console.log("❌ Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      firstName: "Super",
      lastName: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
      isEmailVerified: true,
    });
    console.log("✅ Admin created:", admin.email);

    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();