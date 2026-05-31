import { useEffect, useState } from "react";
import { BookingsContext } from "./bookingsContext";
import api from "../api/api";

function normalizeBooking(booking) {
  return {
    ...booking,
    id: booking._id || booking.id,
  };
}

function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setBookingsLoading(true);

        const { data } = await api.get("/bookings");

        const normalizedBookings = data.bookings.map(normalizeBooking);

        setBookings(normalizedBookings);
        setBookingsError("");
      } catch (error) {
        console.error("Fetch bookings error:", error);
        setBookingsError("Could not load bookings from the server.");
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const addBooking = async (bookingData) => {
    try {
      const payload = {
        customerName: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
      };

      const { data } = await api.post("/bookings", payload);

      const newBooking = normalizeBooking(data.booking);

      setBookings((prevBookings) => [newBooking, ...prevBookings]);

      return {
        success: true,
        booking: newBooking,
      };
    } catch (error) {
      console.error("Create booking error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message || "Could not submit booking request.",
      };
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const endpoint =
        newStatus === "Cancelled"
          ? `/bookings/${bookingId}/cancel`
          : `/bookings/${bookingId}/status`;

      const payload =
        newStatus === "Cancelled"
          ? {}
          : {
              status: newStatus,
            };

      const { data } =
        newStatus === "Cancelled"
          ? await api.patch(endpoint)
          : await api.patch(endpoint, payload);

      const updatedBooking = normalizeBooking(data.booking);

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking,
        ),
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("Update booking status error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message || "Could not update booking status.",
      };
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`);

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId),
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("Delete booking error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Could not delete booking.",
      };
    }
  };

  const clearBookings = () => {
    setBookings([]);
  };

  const value = {
    bookings,
    bookingsLoading,
    bookingsError,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    clearBookings,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}

export default BookingsProvider;
