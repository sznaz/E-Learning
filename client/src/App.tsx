import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import appTheme from "./theme/theme";
import AppRouter from "./router";
import AppInitializer from "./components/AppInitializer";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppInitializer>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppInitializer>
    </ThemeProvider>
  );
}

export default App;
