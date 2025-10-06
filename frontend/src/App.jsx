import { BrowserRouter as Router, useNavigate } from "react-router-dom";
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
import { registerSocketEvents } from "./Socket/socketEvents";
import Loading from "./components/LoadingOverlay";

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
      const socket=dispatch(initializeSocket(token));
      
      registerSocketEvents(socket, dispatch);
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
            <Loading/>
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </div>

    // </AuthProvider>
  );
}

export default App;
