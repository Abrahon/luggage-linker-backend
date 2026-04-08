// generateAccessToken.js
const jwt = require("jsonwebtoken");

module.exports = (user) => {
  console.log("ACCESS SECRET:", process.env.JWT_ACCESS_SECRET); // must print value
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};