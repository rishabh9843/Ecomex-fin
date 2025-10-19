// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ ADD THIS

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// ✅ CORS Configuration - Supports multiple origins including Vercel previews
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // Allow if in allowedOrigins OR ends with .vercel.app
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Important for cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// ✅ ROOT ROUTE - Welcome message
app.get("/", (req, res) => {
  res.json({
    message: "🚀 ECOMEX API is running",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      products: "/api/products",
      orders: "/api/orders",
      categories: "/api/category",
      upload: "/api/upload",
    },
  });
});

// ✅ HEALTH CHECK ENDPOINT
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// ✅ ADD ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  console.error("❌ Error occurred:");
  console.error("URL:", req.method, req.originalUrl);
  console.error("Body:", req.body);
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);
  
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
