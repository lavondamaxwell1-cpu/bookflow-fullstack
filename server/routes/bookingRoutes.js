import express from "express";
import Booking from "../models/Booking.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import BusinessSettings from "../models/BusinessSettings.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  bookingCreatedEmail,
  bookingStatusEmail,
} from "../utils/emailTemplates.js";

const router = express.Router();
// const getBusinessName = async () => {
//   const settings = await BusinessSettings.findOne({ settingsKey: "main" });

//   return settings?.businessName || "BookFlow";
// };
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeToMinutes = (time) => {
  const [hours, minutes] = String(time || "00:00")
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const isValidBookingTime = ({
  time,
  openingTime,
  closingTime,
  slotInterval,
}) => {
  const bookingMinutes = timeToMinutes(time);
  const openingMinutes = timeToMinutes(openingTime);
  const closingMinutes = timeToMinutes(closingTime);
  const interval = Number(slotInterval || 30);

  if (bookingMinutes < openingMinutes || bookingMinutes > closingMinutes) {
    return false;
  }

  return (bookingMinutes - openingMinutes) % interval === 0;
};

const getBusinessSettings = async () => {
  const settings = await BusinessSettings.findOne({ settingsKey: "main" });

  return {
    businessName: settings?.businessName || "BookFlow",
    openingTime: settings?.openingTime || "09:00",
    closingTime: settings?.closingTime || "17:00",
    slotInterval: settings?.slotInterval || 30,
    closedDays: settings?.closedDays || ["Sunday"],
  };
};
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

    const businessSettings = await getBusinessSettings();

    const selectedDate = new Date(`${date}T00:00:00`);
    const selectedDayName = dayNames[selectedDate.getDay()];

    if (businessSettings.closedDays.includes(selectedDayName)) {
      return res.status(400).json({
        success: false,
        message: `This business is closed on ${selectedDayName}. Please choose another date.`,
      });
    }

    const validTime = isValidBookingTime({
      time,
      openingTime: businessSettings.openingTime,
      closingTime: businessSettings.closingTime,
      slotInterval: businessSettings.slotInterval,
    });

    if (!validTime) {
      return res.status(400).json({
        success: false,
        message: `Please choose a valid time between ${businessSettings.openingTime} and ${businessSettings.closingTime}.`,
      });
    }
const existingBooking = await Booking.findOne({
  date,
  time,
  status: {
    $in: ["Pending", "Confirmed"],
  },
});

if (existingBooking) {
  return res.status(409).json({
    success: false,
    message:
      "That date and time is already booked. Please choose another time.",
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

  const businessName = businessSettings.businessName;
    await sendEmail({
      to: booking.email,
      subject: `Booking request received - ${businessName}`,
      html: bookingCreatedEmail({
        booking,
        businessName,
      }),
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
// UPDATE booking status - admin only
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

    const businessName = await getBusinessName();

    if (status === "Confirmed" || status === "Declined") {
      await sendEmail({
        to: booking.email,
        subject: `Booking ${status.toLowerCase()} - ${businessName}`,
        html: bookingStatusEmail({
          booking,
          businessName,
        }),
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

    const businessName = await getBusinessName();

    await sendEmail({
      to: booking.email,
      subject: `Booking cancelled - ${businessName}`,
      html: bookingStatusEmail({
        booking,
        businessName,
      }),
    });

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

// UPDATE full booking - admin only
router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      service,
      date,
      time,
      status,
      notes,
    } = req.body;

    const allowedStatuses = ["Pending", "Confirmed", "Declined", "Cancelled"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const currentBooking = await Booking.findById(req.params.id);

    if (!currentBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const newDate = date || currentBooking.date;
    const newTime = time || currentBooking.time;
const businessSettings = await getBusinessSettings();

const selectedDate = new Date(`${newDate}T00:00:00`);
const selectedDayName = dayNames[selectedDate.getDay()];

if (businessSettings.closedDays.includes(selectedDayName)) {
  return res.status(400).json({
    success: false,
    message: `This business is closed on ${selectedDayName}. Please choose another date.`,
  });
}

const validTime = isValidBookingTime({
  time: newTime,
  openingTime: businessSettings.openingTime,
  closingTime: businessSettings.closingTime,
  slotInterval: businessSettings.slotInterval,
});

if (!validTime) {
  return res.status(400).json({
    success: false,
    message: `Please choose a valid time between ${businessSettings.openingTime} and ${businessSettings.closingTime}.`,
  });
}
    const existingBooking = await Booking.findOne({
      _id: { $ne: req.params.id },
      date: newDate,
      time: newTime,
      status: {
        $in: ["Pending", "Confirmed"],
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message:
          "That date and time is already booked. Please choose another time.",
      });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        email,
        phone,
        service,
        date,
        time,
        status,
        notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Booking updated successfully.",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking.",
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
