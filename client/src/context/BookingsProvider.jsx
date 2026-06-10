import { useEffect, useState } from "react";
import api from "../api/api";
import { BookingsContext } from "./bookingsContext";

const normalizeBooking = (booking) => {
  return {
    ...booking,
    id: booking._id || booking.id,
  };
};

export default function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadInitialBookings = async () => {
      try {
        const { data } = await api.get("/bookings");

        if (!isMounted) return;

        const normalizedBookings = (data.bookings || []).map(normalizeBooking);

        setBookings(normalizedBookings);
        setBookingsError("");
      } catch (err) {
        if (!isMounted) return;

        console.error("Fetch bookings error:", err);
        setBookingsError(
          err.response?.data?.message || "Failed to load bookings.",
        );
      } finally {
        if (isMounted) {
          setBookingsLoading(false);
        }
      }
    };

    loadInitialBookings();

    return () => {
      isMounted = false;
    };
  }, []);

 const fetchBookings = async () => {
   try {
     setBookingsLoading(true);
     setBookingsError("");

     const { data } = await api.get("/bookings");

     const normalizedBookings = (data.bookings || []).map(normalizeBooking);

     setBookings(normalizedBookings);

     return normalizedBookings;
   } catch (err) {
     console.error("Fetch bookings error:", err);

     const message = err.response?.data?.message || "Failed to load bookings.";

     setBookingsError(message);

     throw new Error(message, { cause: err });
   } finally {
     setBookingsLoading(false);
   }
 };

 const addBooking = async (bookingData) => {
   try {
     const { data } = await api.post("/bookings", bookingData);

     const newBooking = normalizeBooking(data.booking);

     setBookings((prev) => [newBooking, ...prev]);

     return newBooking;
   } catch (err) {
     console.error("Add booking error:", err);

     const message = err.response?.data?.message || "Failed to create booking.";

     throw new Error(message, { cause: err });
   }
 };
  const updateBookingStatus = async (bookingId, status) => {
    try {
      const endpoint =
        status === "Cancelled"
          ? `/bookings/${bookingId}/cancel`
          : `/bookings/${bookingId}/status`;

      const payload = status === "Cancelled" ? {} : { status };

      const { data } = await api.patch(endpoint, payload);

      const updatedBooking = normalizeBooking(data.booking);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking,
        ),
      );

      return updatedBooking;
    } catch (err) {
      console.error("Update booking status error:", err);

      const message =
        err.response?.data?.message || "Failed to update booking status.";

      throw new Error(message, { cause: err });
    }
  };

  const updateBooking = async (bookingId, bookingData) => {
    try {
      const { data } = await api.patch(`/bookings/${bookingId}`, bookingData);

      const updatedBooking = normalizeBooking(data.booking);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? updatedBooking : booking,
        ),
      );

      return updatedBooking;
    } catch (err) {
      console.error("Update booking error:", err);

      const message =
        err.response?.data?.message || "Failed to update booking.";

      throw new Error(message, { cause: err });
    }
  };
 const deleteBooking = async (bookingId) => {
   try {
     await api.delete(`/bookings/${bookingId}`);

     setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
   } catch (err) {
     console.error("Delete booking error:", err);

     const message = err.response?.data?.message || "Failed to delete booking.";

     throw new Error(message, { cause: err });
   }
 };
  const value = {
    bookings,
    bookingsLoading,
    bookingsError,

    // keep these aliases so older pages still work
    loading: bookingsLoading,
    error: bookingsError,

    fetchBookings,
    addBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
}
