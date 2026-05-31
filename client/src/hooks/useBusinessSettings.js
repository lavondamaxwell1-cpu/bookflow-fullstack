import { useContext } from "react";
import { BusinessSettingsContext } from "../context/businessSettingsContext";

export function useBusinessSettings() {
  const context = useContext(BusinessSettingsContext);

  if (!context) {
    throw new Error(
      "useBusinessSettings must be used inside BusinessSettingsProvider",
    );
  }

  return context;
}
