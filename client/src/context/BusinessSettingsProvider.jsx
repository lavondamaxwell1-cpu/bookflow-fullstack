import { useEffect, useState } from "react";
import { BusinessSettingsContext } from "./businessSettingsContext";
import api from "../api/api";

const defaultSettings = {
  businessName: "BookFlow",
  tagline: "Simple booking software for local businesses.",
  phone: "(555) 555-5555",
  email: "hello@bookflow.com",
  address: "123 Main Street",
};

function BusinessSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setSettingsLoading(true);

        const { data } = await api.get("/settings");

        setSettings(data.settings);
        setSettingsError("");
      } catch (error) {
        console.error("Fetch settings error:", error);
        setSettingsError("Could not load business settings.");
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const { data } = await api.patch("/settings", newSettings);

      setSettings(data.settings);

      return {
        success: true,
        settings: data.settings,
      };
    } catch (error) {
      console.error("Update settings error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Could not update business settings.",
      };
    }
  };

  const resetSettings = async () => {
    try {
      const { data } = await api.post("/settings/reset");

      setSettings(data.settings);

      return {
        success: true,
        settings: data.settings,
      };
    } catch (error) {
      console.error("Reset settings error:", error);

      return {
        success: false,
        message:
          error.response?.data?.message || "Could not reset business settings.",
      };
    }
  };

  const value = {
    settings,
    settingsLoading,
    settingsError,
    updateSettings,
    resetSettings,
  };

  return (
    <BusinessSettingsContext.Provider value={value}>
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export default BusinessSettingsProvider;
