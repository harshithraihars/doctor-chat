import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import DoctorLogin from "../pages/DoctorLogin";
import SelectSpecialist from "../pages/SelectSpecialist";
import HealthBot from "../pages/HealthBot";
import PrivateRoute from "../components/PrivateRoute";
import DoctorRegister from "../pages/DoctorRegister";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/DocLogin" element={<DoctorLogin />} />
      <Route path="/DocRegister" element={<DoctorRegister />} />

      <Route
        path="/selectspecialist"
        element={
          <PrivateRoute>
            <SelectSpecialist />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <HealthBot />
          </PrivateRoute>
        }
      />
      <Route
        path="/selectspecialist"
        element={
          <PrivateRoute>
            <SelectSpecialist />
          </PrivateRoute>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
