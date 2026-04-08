// generateAccessToken.js
// const jwt = require("jsonwebtoken");
// console.log("ACCESS SECRET:", process.env.JWT_ACCESS_SECRET); // 🔥 debug

// if (!process.env.JWT_ACCESS_SECRET) {
//   console.error("JWT_ACCESS_SECRET is NOT defined!");
// }

// module.exports = (user) => {
//   return jwt.sign(
//     { id: user._id, email: user.email, role: user.role },
//     process.env.JWT_ACCESS_SECRET,
//     { expiresIn: "15m" }
//   );
// };

// generateAccessToken.js
const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role, // ✅ IMPORTANT
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};