import { BrowserRouter as Router } from "react-router-dom";
// import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { initializeSocket } from "./Socket/socketActions";
import { disconnectSocket } from "./redux/socketSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./redux/appSlice";

function App() {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.auth); // get from Redux

  // On first load, restore auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const auth = JSON.parse(localStorage.getItem("auth"));

    if (auth && token) {
      dispatch(loginSuccess({user: auth,token}));
    }

  }, [dispatch]);

  // Initialize socket whenever we have a logged-in user

  useEffect(() => {
    if (user && token) {
      dispatch(initializeSocket(token));
    }

    return () => {
      dispatch(disconnectSocket());
    };
  }, [user, token, dispatch]);

  return (
    // <AuthProvider>
    <div>
      <Router basename="/doctor-chat">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </div>

    // </AuthProvider>
  );
}

export default App;
