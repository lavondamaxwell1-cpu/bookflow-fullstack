import express from "express";
import BusinessSettings from "../models/BusinessSettings.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const defaultSettings = {
  settingsKey: "main",
  businessName: "BookFlow",
  tagline: "Simple booking for modern businesses.",
  phone: "",
  email: "",
  address: "",
  openingTime: "09:00",
  closingTime: "17:00",
  slotInterval: 30,
  closedDays: ["Sunday"],
};

const getSettingsDocument = async () => {
  let settings = await BusinessSettings.findOne({ settingsKey: "main" });

  if (!settings) {
    settings = await BusinessSettings.create(defaultSettings);
    return settings;
  }

  let changed = false;

  Object.entries(defaultSettings).forEach(([key, value]) => {
    if (settings[key] === undefined) {
      settings[key] = value;
      changed = true;
    }
  });

  if (changed) {
    await settings.save();
  }

  return settings;
};

// GET business settings
router.get("/", async (req, res) => {
  try {
    const settings = await getSettingsDocument();

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load settings.",
      error: error.message,
    });
  }
});

// UPDATE business settings - admin only
router.patch("/", protect, adminOnly, async (req, res) => {
  try {
    const settings = await getSettingsDocument();

    const allowedFields = [
      "businessName",
      "tagline",
      "phone",
      "email",
      "address",
      "openingTime",
      "closingTime",
      "slotInterval",
      "closedDays",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    if (settings.slotInterval) {
      settings.slotInterval = Number(settings.slotInterval);
    }

    await settings.save();

    res.json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update settings.",
      error: error.message,
    });
  }
});

// RESET business settings - admin only
router.post("/reset", protect, adminOnly, async (req, res) => {
  try {
    await BusinessSettings.deleteOne({ settingsKey: "main" });

    const settings = await BusinessSettings.create(defaultSettings);

    res.json({
      success: true,
      message: "Settings reset successfully.",
      settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset settings.",
      error: error.message,
    });
  }
});

export default router;
