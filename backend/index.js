// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// utils
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// A list of allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://ecomex-final.vercel.app", // Your main production URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in our static list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } 
    // Check if the origin is a Vercel preview URL for your project
    else if (origin.endsWith("-rishabh-singhs-projects-d32fe9a4.vercel.app")) {
      callback(null, true);
    } 
    else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Use the new dynamic CORS options
app.use(cors(corsOptions));


// 👇 THIS IS THE NEW DEBUGGING ROUTE
app.get("/api/verify-deployment", (req, res) => {
  res.send("Deployment successful! The latest CORS fix is active.");
});


// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Static uploads
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Optional: serve frontend in production (not needed if separate)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.listen(port, () => console.log(`Server running on port: ${port}`));
