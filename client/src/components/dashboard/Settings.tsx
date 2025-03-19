import React, { useEffect, useState } from "react";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import General from "./Settings/General";
import Security from "./Settings/Security";
import Data from "./Settings/Data";
import axios from "axios";

function Settings() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
  });

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

  return (
    <Box sx={{ maxWidth: 700, m: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <General userData={userData} />
      <Security />
      <Data />
    </Box>
  );
}

export default Settings;
