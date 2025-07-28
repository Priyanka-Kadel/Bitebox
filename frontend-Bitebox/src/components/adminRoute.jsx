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

  // 1. If not logged in, redirect with state
  if (!user) {
    return <Navigate to="/login" state={{ from: location, adminOnly: true }} replace />;
  }

  // 2. If user is admin, allow access
  if (user.role === "admin") {
    return <Outlet />;
  }


  if (user && user.role !== "admin") {
    navigate(-1);
    setTimeout(() => {
      window.dispatchEvent(new Event('admin-access-denied'));
    }, 50); 
    return null;
  }
};

export default AdminRoute;
