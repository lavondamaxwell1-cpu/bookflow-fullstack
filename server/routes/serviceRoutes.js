import express from "express";
import Service from "../models/Service.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();

// GET all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
      error: error.message,
    });
  }
});

// CREATE service
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, duration, active } = req.body;

    if (!name || !description || price === "" || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required service fields.",
      });
    }

    const service = await Service.create({
      name,
      description,
      price: Number(price),
      duration,
      active: active ?? true,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create service.",
      error: error.message,
    });
  }
});

// UPDATE service
router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, description, price, duration, active } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        duration,
        active,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.json({
      success: true,
      message: "Service updated successfully.",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update service.",
      error: error.message,
    });
  }
});

// TOGGLE active/hidden
router.patch("/:id/toggle", protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    service.active = !service.active;
    await service.save();

    res.json({
      success: true,
      message: "Service status updated.",
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle service.",
      error: error.message,
    });
  }
});

// DELETE service
router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.json({
      success: true,
      message: "Service deleted.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete service.",
      error: error.message,
    });
  }
});

export default router;
