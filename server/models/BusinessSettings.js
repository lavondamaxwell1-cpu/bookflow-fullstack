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
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const BusinessSettings = mongoose.model(
  "BusinessSettings",
  businessSettingsSchema
);

export default BusinessSettings;
