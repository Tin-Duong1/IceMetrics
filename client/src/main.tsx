import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider, THEME_ID } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import theme from "./theme";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={{ [THEME_ID]: theme }}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
