const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const inventoryRouter = require("./routes/inventoryRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const orderRouter = require("./routes/orderRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const errorHandler = require("./middleware/errorHandler");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminLogRoutes = require("./routes/adminLogRoutes");

const app = express();

// ================= TRUST PROXY (required for express-rate-limit behind Render/Heroku) =================
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        process.env.FRONTEND_URL, // cloud frontend URL (set on Render)
      ].filter(Boolean); // removes undefined entries

      // allow server-to-server / curl requests (no Origin header)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// ================= PASSPORT =================
require("./config/passport");
app.use(passport.initialize());

// ================= DATABASE =================

// MySQL
const sequelize = require("./config/db");
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connected");
    // Use alter:true only in development; TiDB doesn't support some ALTER operations
    if (process.env.NODE_ENV === "production") {
      return sequelize.sync();
    }
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log("✅ Tables synced"))
  .catch((err) => console.log(err));

// MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// ================= ROUTES =================

// Auth + Users
app.use("/auth", require("./routes/authRoute"));
app.use("/users", require("./routes/UserRoute"));

// Products

app.use("/api/v1/products", productRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin/logs", adminLogRoutes);

// Admin
app.use("/api", require("./routes/adminRequestRoutes"));

// Test
app.get("/", (req, res) => {
  res.send("Merged Backend Running 🚀");
});

app.use("/avatars", express.static("public/Avatar"));

app.use(errorHandler);

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});
