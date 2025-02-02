import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./components/SignIn";
import NavLayout from "./components/NavLayout";
import Home from "./Home";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import SignUp from "./components/SignUp";
import About from "./About";
import { AnimatePresence } from "framer-motion";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<NavLayout />}>
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
