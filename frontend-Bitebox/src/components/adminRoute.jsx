import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const AdminRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  // 1. If not logged in, redirect with state (do NOT dispatch event here)
  if (!user) {
    return <Navigate to="/login" state={{ from: location, adminOnly: true }} replace />;
  }

  // 2. If user is admin, allow access
  if (user.role === "admin") {
    return <Outlet />;
  }

  // 3. If user is non-admin, show toast via event and go back
  if (user && user.role !== "admin") {
    navigate(-1); // or to any route you want
    setTimeout(() => {
      window.dispatchEvent(new Event('admin-access-denied'));
    }, 50); // Short delay to ensure navigation completes
    return null;
  }
};

export default AdminRoute;
