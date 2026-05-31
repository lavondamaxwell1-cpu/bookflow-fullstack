import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookingsProvider from "./context/BookingsProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import BookAppointment from "./pages/BookAppointment";
import Portal from "./pages/Portal";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminServices from "./pages/AdminServices";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ServicesProvider from "./context/ServicesProvider";
import BusinessSettingsProvider from "./context/BusinessSettingsProvider";
import AdminSettings from "./pages/AdminSettings";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/AdminLayout";
import AuthProvider from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import AdminCustomers from "./pages/AdminCustomers";


function App() {
  return (
    <AuthProvider>
      <BusinessSettingsProvider>
        <ServicesProvider>
          <BookingsProvider>
            <BrowserRouter>
              <Navbar />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/book" element={<BookAppointment />} />
                <Route path="/portal" element={<Portal />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="services" element={<AdminServices />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="customers" element={<AdminCustomers />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              <Footer />
            </BrowserRouter>
          </BookingsProvider>
        </ServicesProvider>
      </BusinessSettingsProvider>
    </AuthProvider>
  );
}
export default App;
