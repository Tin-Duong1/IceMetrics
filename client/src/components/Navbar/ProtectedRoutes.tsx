import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const token = localStorage.getItem("jwt_token");

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("activePage");
        return true;
      }
      return false;
    } catch (error) {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("activePage");
      return true;
    }
  };

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/signin" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
