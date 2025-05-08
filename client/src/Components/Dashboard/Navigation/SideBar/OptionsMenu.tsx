import { MoreVertRounded } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

function OptionsMenu({
  setActivePage,
}: {
  setActivePage: (page: string) => void;
}) {
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
        transformOrigin={{ horizontal: 40, vertical: 100 }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{ zIndex: 10000 }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setActivePage("Settings");
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Log out
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default OptionsMenu;
