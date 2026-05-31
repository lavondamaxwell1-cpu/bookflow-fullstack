import { useContext } from "react";
import { BookingsContext } from "../context/bookingsContext";

export function useBookings() {
  const context = useContext(BookingsContext);

  if (!context) {
    throw new Error("useBookings must be used inside BookingsProvider");
  }

  return context;
}
