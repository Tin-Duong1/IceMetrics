import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useState } from "react";
import SideBar from "./components/dashboard/SideBar";
import Settings from "./components/dashboard/Settings";
import Home from "./components/dashboard/Home/Home";
import { Link } from "react-router";

function Dashboard() {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    switch (activePage) {
      case "Settings":
        return <Settings />;
      case "Home":
        return <Home />;
      default:
        return <div>{activePage}</div>; // Placeholder for other pages
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar setActivePage={setActivePage} />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <Box sx={{ padding: 4 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography sx={{ color: "grey" }}>Dashboard</Typography>
            <Typography sx={{ color: "text.primary" }}>{activePage}</Typography>
          </Breadcrumbs>
        </Box>
        <Box>{renderPage()}</Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
