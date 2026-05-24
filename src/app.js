
// // src/app.js
// const express = require("express");
// const cors = require("cors");

// const app = express();

// // --- MIDDLEWARE ---
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // --- DEBUG BODY (optional, remove in production) ---
// app.use((req, res, next) => {
//   console.log("BODY DEBUG:", req.body);
//   next();
// });

// // --- ROUTES ---
// app.get("/", (req, res) => {
//   res.send("LuggageLinker API Running");
// });

// app.use("/api/auth", require("./routes/auth.routes"));
// app.use("/api/users", require("./routes/user.routes"));
// app.use("/api/profile", require("./routes/profile.routes"));
// app.use("/api/dashboard", require("./routes/dashboard.routes"));
// app.use("/api/trip", require("./routes/trip.routes"));
// app.use("/api/booking", require("./routes/booking.routes"));


// // --- GLOBAL ERROR HANDLER ---
// app.use((err, req, res, next) => {
//   console.error("🔥 ERROR STACK:", err.stack || err);
//   res.status(err.status || 500).json({
//     message: err.message || "Internal Server Error",
//     error: err.stack || err,
//   });
// });

// module.exports = app;


const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express();

// ========================================
// SECURITY MIDDLEWARE
// ========================================

app.use(helmet());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(mongoSanitize());

app.use(xss());

app.use(compression());

app.use(cookieParser());

// ========================================
// RATE LIMITING
// ========================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message:
    "Too many requests from this IP",
});

app.use(limiter);

// ========================================
// BODY PARSER
// ========================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ========================================
// DEBUG LOGGER
// ========================================

if (
  process.env.NODE_ENV === "development"
) {
  app.use((req, res, next) => {
    console.log(
      `${req.method} ${req.originalUrl}`
    );

    next();
  });
}

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "LuggageLinker API Running",
  });
});

// ========================================
// API ROUTES
// ========================================

app.use(
  "/api/v1/auth",
  require("./routes/auth.routes")
);

app.use(
  "/api/v1/users",
  require("./routes/user.routes")
);

app.use(
  "/api/v1/profile",
  require("./routes/profile.routes")
);

app.use(
  "/api/v1/dashboard",
  require("./routes/dashboard.routes")
);

app.use(
  "/api/v1/trips",
  require("./routes/trip.routes")
);

app.use(
  "/api/v1/bookings",
  require("./routes/booking.routes")
);

app.use(
  "/api/v1/memberships",
  require(
    "./routes/membership.routes"
  )
);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.message ||
      "Internal Server Error",
  });
});

module.exports = app;