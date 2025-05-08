import React, { useState, useEffect } from "react";
import { grey } from "@mui/material/colors";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { CloseRounded, Menu } from "@mui/icons-material";
import LargeLogo from "/LogoBlack.svg";
import Title from "/title.png";
import { Link } from "react-router";

const pages = [
  { name: "Home", route: "/" },
  { name: "About Us", route: "/about" },
];

function NavBar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (changeOpen: boolean) => () => {
    setOpen(changeOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        padding: "8px 12px",
        marginBlock: "28px",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          backdropFilter: "blur(24px)",
          bgcolor: "white",
          borderRadius: 4,
          mx: 2,
          paddingInlineEnd: "16px !important",
          boxShadow:
            "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
          transition: "background-color 2s ease-in-out",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Box>
              <img height={36} src={LargeLogo} />
            </Box>{" "}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <img height={24} src={Title} />
            </Box>
          </div>
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: 4 }}>
            {pages.map((page) => {
              return (
                <Button
                  variant="text"
                  size="medium"
                  color="primary"
                  component={Link}
                  to={page.route}
                >
                  {page.name}
                </Button>
              );
            })}
          </Box>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          <Button variant="text" color="primary" component={Link} to="/signin">
            Sign in
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/signup"
          >
            Sign up
          </Button>
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            sx={{
              border: "1px solid",
              borderColor: grey[400],
              borderRadius: 2,
            }}
            aria-label="menu-button"
            onClick={toggleDrawer(true)}
          >
            <Menu />
          </IconButton>
          <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginInline: 2,
                marginBlock: 2,
              }}
            >
              <img height={36} src={LargeLogo} />
              <IconButton
                sx={{
                  border: "1px solid",
                  borderColor: grey[400],
                  borderRadius: 2,
                }}
                aria-label="close-menu"
                onClick={toggleDrawer(false)}
              >
                <CloseRounded />
              </IconButton>
            </Box>
            <List>
              {pages.map((page) => (
                <ListItemButton component={Link} to={page.route}>
                  <ListItemText sx={{ color: "black" }} primary={page.name} />
                </ListItemButton>
              ))}
            </List>

            <Divider />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                px: 2,
                py: 3,
              }}
            >
              <Button
                sx={{ py: 1.5 }}
                variant="contained"
                color="primary"
                component={Link}
                to="/signin"
              >
                Sign in
              </Button>
              <Button
                sx={{ py: 1.5 }}
                variant="outlined"
                color="primary"
                component={Link}
                to="/signup"
              >
                Sign up
              </Button>
            </Box>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
