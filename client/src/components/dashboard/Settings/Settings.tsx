import { useEffect, useState } from "react";
import { Box, Divider, TextField, Typography } from "@mui/material";
import DeleteAccount from "./DeleteAccount";
import axios from "axios";
import PasswordChange from "./PasswordChange";

function Settings() {
  const [userData, setUserData] = useState({
    username: "",
    name: "",
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
      <Box sx={{ maxWidth: 800 }}>
        <Divider />
        <div>
          <Box
            sx={{
              my: 3,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography width={150}>Full Name</Typography>
            <TextField
              disabled
              sx={{ flexGrow: 1, maxWidth: 500 }}
              value={userData.name}
            />
          </Box>
          <Box
            sx={{
              my: 3,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography width={150}>Email</Typography>
            <TextField
              disabled
              sx={{ flexGrow: 1, maxWidth: 500 }}
              value={userData.email}
            />
          </Box>
        </div>
        <Divider />
      </Box>
      <PasswordChange />
      <DeleteAccount />
    </Box>
  );
}

export default Settings;
