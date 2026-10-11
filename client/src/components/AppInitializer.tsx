import React, { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { authApi } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // If currently on login page, skip refresh on page refresh
    if (window.location.pathname === "/login") {
      setInitialized(true);
      return;
    }

    const initAuth = async () => {
      try {
        const res = await authApi.refresh();
        if (mounted && res.data?.token && res.data?.user) {
          setAuth(res.data.user, res.data.token);
        }
      } catch {
        if (mounted) {
          clearAuth();
        }
      } finally {
        if (mounted) {
          setInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [setAuth, clearAuth]);

  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;
