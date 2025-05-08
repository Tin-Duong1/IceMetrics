import { Box, Drawer, IconButton } from "@mui/material";
import { useState } from "react";
import SideBarLogo from "../SideBar/SideBarLogo";
import MenuContent from "../MenuContent";
import SideBarAccount from "../SideBar/SideBarAccount";
import { grey } from "@mui/material/colors";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "/LogoBlack.svg";

function TopBar({
  setActivePage,
  activePage,
  userData,
}: {
  setActivePage: (page: string) => void;
  activePage: string;
  userData: { name: string; email: string; phoneNumber: string } | null;
}) {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (changeOpen: boolean) => () => {
    setOpen(changeOpen);
  };

  return (
    <Box>
      <Box
        sx={{
          position: "fixed",
          backgroundColor: grey[100],
          width: "100%",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: grey[300],
          padding: 2,
          zIndex: 1300,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={Logo} height={36} alt="logo" />
        </Box>
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        anchor="right"
        open={open}
        sx={{ zIndex: 1400 }}
        onClose={toggleDrawer(false)}
      >
        <SideBarLogo />
        <MenuContent
          setActivePage={(page) => {
            setActivePage(page);
            setOpen(false);
          }}
          activePage={activePage}
        />
        {userData && (
          <SideBarAccount userData={userData} setActivePage={setActivePage} />
        )}
      </Drawer>
    </Box>
  );
}

export default TopBar;
