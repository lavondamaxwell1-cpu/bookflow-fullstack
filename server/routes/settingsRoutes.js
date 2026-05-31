import express from "express";
import BusinessSettings from "../models/BusinessSettings.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
const router = express.Router();

const defaultSettings = {
  settingsKey: "main",
  businessName: "BookFlow",
  tagline: "Simple booking software for local businesses.",
  phone: "(555) 555-5555",
  email: "hello@bookflow.com",
  address: "123 Main Street",
};

// GET business settings
router.get("/", async (req, res) => {
  try {
    let settings = await BusinessSettings.findOne({ settingsKey: "main" });

    if (!settings) {
      settings = await BusinessSettings.create(defaultSettings);
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch business settings.",
      error: error.message,
    });
  }
});

// UPDATE business settings
router.patch("/", protect, adminOnly, async (req, res) => {
  try {
    const { businessName, tagline, phone, email, address } = req.body;

    if (!businessName || !tagline || !phone || !email || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all business settings fields.",
      });
    }

    const settings = await BusinessSettings.findOneAndUpdate(
      { settingsKey: "main" },
      {
        settingsKey: "main",
        businessName,
        tagline,
        phone,
        email,
        address,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "Business settings updated.",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update business settings.",
      error: error.message,
    });
  }
});

// RESET business settings
router.post("/reset", protect, adminOnly, async (req, res) => {
  try {
    const settings = await BusinessSettings.findOneAndUpdate(
      { settingsKey: "main" },
      defaultSettings,
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.json({
      success: true,
      message: "Business settings reset.",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset business settings.",
      error: error.message,
    });
  }
});

export default router;
