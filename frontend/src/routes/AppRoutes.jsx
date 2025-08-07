import { Suspense } from "react";
import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import LazyLoad from "../components/LazyLoad";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const DoctorLogin = lazy(() => import("../pages/DoctorLogin"));
const SelectSpecialist = lazy(() => import("../pages/SelectSpecialist"));
const HealthBot = lazy(() => import("../pages/HealthBot"));
const PrivateRoute = lazy(() => import("../components/PrivateRoute"));
const DoctorRegister = lazy(() => import("../pages/DoctorRegister"));
const ChatBot=lazy(()=>import("../pages/ChatBot"))
export default function AppRoutes() {
  return (
    <Suspense fallback={<LazyLoad />}>
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
          path="/chatbot"
          element={
            <PrivateRoute>
              <ChatBot />
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
    </Suspense>
  );
}
