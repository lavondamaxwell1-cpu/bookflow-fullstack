import express from "express";
import Booking from "../models/Booking.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();

// GET all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
      error: error.message,
    });
  }
});

// CREATE booking
router.post("/", async (req, res) => {
  try {
    const { customerName, email, phone, service, date, time, notes } = req.body;

    if (!customerName || !email || !phone || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking fields.",
      });
    }

    const booking = await Booking.create({
      customerName,
      email,
      phone,
      service,
      date,
      time,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking.",
      error: error.message,
    });
  }
});

// UPDATE booking status
router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Confirmed", "Declined", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    res.json({
      success: true,
      message: "Booking status updated.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
      error: error.message,
    });
  }
});

// CUSTOMER CANCEL booking
router.patch("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    res.json({
      success: true,
      message: "Booking cancelled.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking.",
      error: error.message,
    });
  }
});

// DELETE booking
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete booking.",
      error: error.message,
    });
  }
});

export default router;
