import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

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
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default theme;
