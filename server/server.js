import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";



dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("BookFlow API is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "BookFlow backend is healthy",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/settings", settingsRoutes);





app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
