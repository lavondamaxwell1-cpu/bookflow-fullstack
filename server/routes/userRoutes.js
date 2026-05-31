import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  createdAt: user.createdAt,
});

// GET all customers - admin only
router.get("/customers", protect, adminOnly, async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      customers: customers.map(formatUser),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers.",
      error: error.message,
    });
  }
});

// UPDATE logged-in user's profile
router.patch("/profile", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "That email is already being used.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
        phone: phone || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
});

export default router;
