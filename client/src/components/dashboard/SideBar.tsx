import { Box, Divider } from "@mui/material";
import React from "react";
import MenuContent from "./MenuContent";
import SideBarLogo from "./SideBarLogo";
import { grey } from "@mui/material/colors";

function SideBar() {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: grey[100],
        display: "flex",
        flexDirection: "column",
        borderInlineEnd: "1px solid",
        borderColor: grey[200],
      }}
    >
      <SideBarLogo />
      <MenuContent />
    </Box>
  );
}

export default SideBar;
