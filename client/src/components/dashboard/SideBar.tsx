import { Box } from "@mui/material";
import React from "react";
import MenuContent from "./MenuContent";

function SideBar() {
  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "primary.main",
        display: "block",
      }}
    >
      <MenuContent />
    </Box>
  );
}

export default SideBar;
