const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("../config/db");   // ✅ one level up
const User = require("../models/user.model"); // ✅ one level up

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
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("✅ Admin created successfully:");
    console.log(admin);

    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();