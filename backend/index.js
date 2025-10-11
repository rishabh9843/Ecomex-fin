// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // 👈 Add this

// Utils
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

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Enable CORS for your Vercel frontend
app.use(
  cors({
    origin: ["https://ecomex-final-4.vercel.app"], // your Vercel frontend domain
    credentials: true,
  })
);

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Paypal Config route
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// ✅ Static uploads folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ✅ Test root route (important for Render)
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// ✅ Fallback for non-existing routes (optional but clean)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
app.listen(port, () => console.log(`Server running on port: ${port}`));
