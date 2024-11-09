import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useParams } from "react-router-dom";

function AuthChecking({ children }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // If there's no user, and the route is admin, redirect to sign in
    if (location.pathname.includes("/admin")) {
      return <Navigate to="/signin" />;
    }
    if (location.pathname.includes("/checkout")) {
      return <Navigate to="/" />;
    }
    // Allow other routes to render
    return <>{children}</>;
  }
  if (
    location.pathname.includes("/signin") ||
    location.pathname.includes("/signup")
  ) {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  //Allowing user only
  if (user.role !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/" />;
  }

  const pathSegments = location.pathname.split("/");
  const firstId = pathSegments[2];
  // if (cartToken !== token && location.pathname.includes("/checkout")) {
  //   return <Navigate to="/" />;
  // }
  if (user.role === "admin" && !location.pathname.includes("/admin")) {
    //Allowing admin only
    return <Navigate to="/admin/dashboard" />;
  }
  return <>{children}</>;
}

export default AuthChecking;
