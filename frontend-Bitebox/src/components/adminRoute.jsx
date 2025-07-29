import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const getUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const AdminRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location, adminOnly: true }} replace />;
  }

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
