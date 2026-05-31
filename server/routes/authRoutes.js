import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
});

const ensureDefaultAdmin = async () => {
  const adminEmail = "admin@bookflow.com";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      phone: "",
      role: "admin",
    });

    console.log("Default admin created: admin@bookflow.com / admin123");
  }
};

// REGISTER customer
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      role: "customer",
    });

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user.",
      error: error.message,
    });
  }
});

// LOGIN admin/customer
router.post("/login", async (req, res) => {
  try {
    await ensureDefaultAdmin();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user._id);

    res.json({
      success: true,
      message: "Login successful.",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to login.",
      error: error.message,
    });
  }
});

// GET current logged-in user
router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    user: formatUser(req.user),
  });
});

export default router;
