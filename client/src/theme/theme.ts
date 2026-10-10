import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5", // Indigo 600
      light: "#818cf8",
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#7c3aed", // Violet 600
      light: "#a78bfa",
      dark: "#5b21b6",
      contrastText: "#ffffff",
    },
    success: {
      main: "#10b981", // Emerald 500
      light: "#34d399",
      dark: "#059669",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    info: {
      main: "#0284c7",
      light: "#38bdf8",
      dark: "#0369a1",
    },
    background: {
      default: "#f8fafc", // Slate 50
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // Slate 900
      secondary: "#64748b", // Slate 500
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "8px 20px",
          boxShadow: "none",
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
          border: "1px solid #f1f5f9",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#475569",
          backgroundColor: "#f8fafc",
          borderBottom: "2px solid #e2e8f0",
        },
        body: {
          borderBottom: "1px solid #f1f5f9",
        },
      },
    },
  },
});

export default appTheme;
