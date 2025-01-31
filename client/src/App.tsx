import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./components/SignIn";
import NavLayout from "./components/NavLayout";
import Home from "./Home";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route element={<NavLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/login" element={<SignIn />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
