import {
  Badge,
  Box,
  Breadcrumbs,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import SideBar from "./components/dashboard/SideBar";
import Settings from "./components/dashboard/Settings";
import Home from "./components/dashboard/Home/Home";
import Search from "./components/dashboard/Search";
import { Notifications } from "@mui/icons-material";
import Uploads from "./components/dashboard/Uploads";
import Feedback from "./components/dashboard/Feedback";

function Dashboard() {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    switch (activePage) {
      case "Settings":
        return <Settings />;
      case "Home":
        return <Home />;
      case "Uploads":
        return <Uploads />;
      case "Feedback":
        return <Feedback />;
      default:
        return <div>{activePage}</div>; // Placeholder for other pages
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar setActivePage={setActivePage} activePage={activePage} />
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        <Stack
          direction={"row"}
          sx={{
            paddingInline: 4,
            paddingTop: 4,
            paddingBottom: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Typography sx={{ color: "grey" }}>Dashboard</Typography>
            <Typography sx={{ color: "text.primary" }}>{activePage}</Typography>
          </Breadcrumbs>
          <Stack direction={"row"} spacing={2} alignItems="center">
            <Search />
            <Badge color="error" variant="dot" invisible={true}>
              <IconButton
                size="small"
                aria-label="settings"
                sx={{
                  border: "1px solid",
                  borderColor: "grey.400",
                  borderRadius: 2,
                  width: 42,
                  height: 42,
                }}
              >
                <Notifications fontSize="small" />
              </IconButton>
            </Badge>
          </Stack>
        </Stack>
        <Box>{renderPage()}</Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
