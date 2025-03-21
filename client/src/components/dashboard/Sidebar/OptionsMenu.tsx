import { MoreVertRounded } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

function OptionsMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-label="settings"
        sx={{
          ":hover": {
            border: "1px solid",
            backgroundColor: grey[400],
          },
          borderRadius: 2,
          width: 42,
          height: 42,
        }}
      >
        <MoreVertRounded />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 40, vertical: 130 }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            localStorage.clear(); // Clear local storage on logout
            window.location.href = "/"; // Redirect to sign-in page
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default OptionsMenu;
