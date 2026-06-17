

// generateAccessToken.js
const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role, 
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};