import { createTheme } from "@mui/material/styles";
import { grey, red } from "@mui/material/colors";
import type {} from "@mui/x-charts/themeAugmentation";

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
        textPrimary: {
          color: "black",
        },
        containedPrimary: {
          color: "white",
          backgroundColor: "black",
        },
        outlinedPrimary: {
          color: "black",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 42,
          backgroundColor: grey[50],
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: "transparent",
          "&.Mui-selected": {
            backgroundColor: grey[200],
            "& .MuiListItemIcon-root": {
              color: "black", // Change to primary.main color
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: grey[300],
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          width: 40,
          color: grey[600],
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          width: 150,
        },
      },
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default theme;
