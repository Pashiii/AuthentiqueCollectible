import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease",
      once: true,
      offset: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-fullbg ">
      <Navbar />
      <ScrollRestoration />
      <Outlet />
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default App;
