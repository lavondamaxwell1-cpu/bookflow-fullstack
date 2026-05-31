import { useContext } from "react";
import { ServicesContext } from "../context/servicesContext";

export function useServices() {
  const context = useContext(ServicesContext);

  if (!context) {
    throw new Error("useServices must be used inside ServicesProvider");
  }

  return context;
}
