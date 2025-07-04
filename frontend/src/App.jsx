import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import AppRoutes from "./routes/AppRoutes";
import { useSocketInit } from "./Socket/useSocketInit";
import { Toaster } from "react-hot-toast";

function App() {
  useSocketInit();
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
      <Toaster position="top-center" reverseOrder={false}/>
    </AuthProvider>
  );
}

export default App;
