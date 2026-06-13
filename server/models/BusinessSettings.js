import mongoose from "mongoose";

const businessSettingsSchema = new mongoose.Schema(
  {
    settingsKey: {
      type: String,
      default: "main",
      unique: true,
    },

    businessName: {
      type: String,
      default: "BookFlow",
    },

    tagline: {
      type: String,
      default: "Simple booking for modern businesses.",
    },

    phone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "09:00",
    },

    closingTime: {
      type: String,
      default: "17:00",
    },

    slotInterval: {
      type: Number,
      default: 30,
    },

    closedDays: {
      type: [String],
      default: ["Sunday"],
    },
  },
  {
    timestamps: true,
  },
);

const BusinessSettings = mongoose.model(
  "BusinessSettings",
  businessSettingsSchema,
);

export default BusinessSettings;
