import { useEffect, useState } from "react";
import { ServicesContext } from "./servicesContext";
import api from "../api/api";

function normalizeService(service) {
  return {
    ...service,
    id: service._id || service.id,
  };
}

function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);

        const { data } = await api.get("/services");

        const normalizedServices = data.services.map(normalizeService);

        setServices(normalizedServices);
        setServicesError("");
      } catch (error) {
        console.error("Fetch services error:", error);
        setServicesError("Could not load services from the server.");
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const addService = async (serviceData) => {
    try {
      const { data } = await api.post("/services", serviceData);

      const newService = normalizeService(data.service);

      setServices((prevServices) => [newService, ...prevServices]);

      return {
        success: true,
        service: newService,
      };
    } catch (error) {
      console.error("Create service error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Could not create service.",
      };
    }
  };

  const toggleService = async (serviceId) => {
    try {
      const { data } = await api.patch(`/services/${serviceId}/toggle`);

      const updatedService = normalizeService(data.service);

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId ? updatedService : service,
        ),
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("Toggle service error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Could not update service.",
      };
    }
  };

  const deleteService = async (serviceId) => {
    try {
      await api.delete(`/services/${serviceId}`);

      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceId),
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("Delete service error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Could not delete service.",
      };
    }
  };

  const value = {
    services,
    servicesLoading,
    servicesError,
    addService,
    toggleService,
    deleteService,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}

export default ServicesProvider;
