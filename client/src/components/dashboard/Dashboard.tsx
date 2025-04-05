import {
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useState, useEffect } from "react";
import SideBar from "./Sidebar/SideBar";
import Settings from "./Settings/Settings";
import Home from "./Home/Home";
import Search from "./Search";
import { Notifications } from "@mui/icons-material";
import Uploads from "./Uploads";
import Feedback from "./Feedback/Feedback";
import Analysis from "./Analysis/Analysis";
import TopBar from "./Sidebar/TopBar";

function Dashboard() {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") || "Home";
  });

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  const renderPage = () => {
    switch (activePage) {
      case "Analytics":
        return <Analysis />;
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
    <Box>
      <Box sx={{ display: { xs: "block", lg: "none", zIndex: 1000 } }}>
        <TopBar setActivePage={setActivePage} activePage={activePage} />
      </Box>
      <Box sx={{ display: "flex", height: "100vh", zIndex: 0 }}>
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <SideBar setActivePage={setActivePage} activePage={activePage} />
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
          <Stack
            direction={"row"}
            sx={{
              paddingInline: 4,
              paddingTop: { xs: 15, lg: 4 },
              paddingBottom: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Typography sx={{ color: "grey" }}>Dashboard</Typography>
              <Typography sx={{ color: "text.primary" }}>
                {activePage}
              </Typography>
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
    </Box>
  );
}

export default Dashboard;
