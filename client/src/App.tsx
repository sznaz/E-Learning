import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import appTheme from "./theme/theme";
import AppRouter from "./router";
import AppInitializer from "./components/AppInitializer";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AppInitializer>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AppInitializer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
