import { Box, Breadcrumbs, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import SideBar from "../Components/Dashboard/Navigation/SideBar/SideBar";
import Settings from "../Components/Dashboard/Settings/Settings";
import Home from "../Components/Dashboard/Home/Home";
import Uploads from "../Components/Dashboard/Uploads";
import Feedback from "../Components/Dashboard/Feedback/Feedback";
import Analysis from "../Components/Dashboard/Analysis/Analysis";
import TopBar from "../Components/Dashboard/Navigation/TopBar/TopBar";
import axios from "axios";

function Dashboard() {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") || "Home";
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get("/api/me/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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
        return <div>{activePage}</div>;
    }
  };

  return (
    <Box>
      <Box sx={{ display: { xs: "block", lg: "none", zIndex: 1000 } }}>
        <TopBar
          setActivePage={setActivePage}
          activePage={activePage}
          userData={userData}
        />
      </Box>
      <Box sx={{ display: "flex", height: "100vh", zIndex: 0 }}>
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <SideBar
            setActivePage={setActivePage}
            activePage={activePage}
            userData={userData}
          />
        </Box>
        <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
          <Stack
            direction={"row"}
            sx={{
              paddingInline: 4,
              paddingTop: { xs: 12, lg: 4 },
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
          </Stack>
          <Box>{renderPage()}</Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
