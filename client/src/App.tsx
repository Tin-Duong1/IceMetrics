import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./Components/Landing/SignIn";
import NavLayout from "./Components/Navbar/NavLayout";
import SignUp from "./Components/Landing/SignUp";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoutes from "./Components/Navbar/ProtectedRoutes";
import Home from "./Pages/Home";
import About from "./Pages/About";

export default function App() {
  const jwtToken = localStorage.getItem("jwt_token");

  return (
    <Router>
      <Routes>
        <Route element={<NavLayout />}>
          <Route
            index
            element={jwtToken ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
