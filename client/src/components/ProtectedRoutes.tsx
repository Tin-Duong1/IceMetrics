import React from "react";
import { Route, Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem("jwt_token");

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
