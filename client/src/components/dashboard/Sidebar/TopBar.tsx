import { Box, Button, Drawer, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import SideBarLogo from "./SideBarLogo";
import MenuContent from "./MenuContent";
import SideBarAccount from "./SideBarAccount";
import axios from "axios";
import { grey } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "/LogoBlack.svg";
import Title from "/title.png";

function TopBar({
  setActivePage,
  activePage,
}: {
  setActivePage: (page: string) => void;
  activePage: string;
}) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (changeOpen: boolean) => () => {
    setOpen(changeOpen);
  };

  const [userData, setUserData] = useState({
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
    <Box>
      <Box
        sx={{
          position: "fixed",
          backgroundColor: grey[100],
          width: "100%",
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          zIndex: 1300, // Ensure it is above other elements
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={Logo} height={36} alt="logo" />
          <img src={Title} height={36} alt="logo" />
        </Box>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <SideBarLogo />
        <MenuContent
          setActivePage={(page) => {
            setActivePage(page);
            setOpen(false);
          }}
          activePage={activePage}
        />
        <SideBarAccount
          name={userData.name}
          email={userData.email}
          phoneNumber={userData.phoneNumber}
        />
      </Drawer>
    </Box>
  );
}

export default TopBar;
