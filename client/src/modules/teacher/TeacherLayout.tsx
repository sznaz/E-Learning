import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Chip,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  DashboardOutlined,
  SchoolOutlined,
  VideoCameraFrontOutlined,
  MenuBookOutlined,
  LogoutOutlined,
  PublicOutlined,
  AddCircleOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const DRAWER_WIDTH = 260;

export const TeacherLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/teacher", icon: <DashboardOutlined /> },
    { label: "Sessions", path: "/teacher/sessions", icon: <VideoCameraFrontOutlined /> },
    { label: "My Students", path: "/teacher/students", icon: <SchoolOutlined /> },
    { label: "Courses", path: "/teacher/courses", icon: <MenuBookOutlined /> },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d1b2a", // Deep navy blue
        color: "#f8fafc",
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
          }}
        >
          <SchoolOutlined fontSize="small" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
            Teacher Portal
          </Typography>
          <Typography variant="caption" sx={{ color: "#38bdf8", fontWeight: 600 }}>
            E-Learn Faculty Hub
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

      {/* Quick Action Button */}
      <Box sx={{ px: 2, pt: 2.5, pb: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddCircleOutlined />}
          component={RouterLink}
          to="/teacher/sessions?action=new"
          onClick={() => isMobile && setMobileOpen(false)}
          sx={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#ffffff",
            fontWeight: 700,
            py: 1,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
            },
          }}
        >
          Schedule Session
        </Button>
      </Box>

      {/* Navigation Links */}
      <List sx={{ px: 2, py: 1.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.path === "/teacher"
              ? location.pathname === "/teacher"
              : location.pathname.startsWith(item.path);

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.8 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive
                    ? "rgba(16, 185, 129, 0.16)"
                    : "transparent",
                  color: isActive ? "#34d399" : "#94a3b8",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    color: "#f8fafc",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "#34d399" : "#64748b",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.92rem",
                        fontWeight: isActive ? 700 : 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}

      </List>

      {/* Teacher Footer Profile */}
      <Box
        sx={{
          p: 2,
          m: 2,
          borderRadius: 2.5,
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#10b981",
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0) || "T"}
          </Avatar>
          <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 700, color: "#f8fafc" }}
            >
              {user?.name || "Teacher"}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: "#38bdf8", display: "block", fontWeight: 600 }}
            >
              Faculty Instructor
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<LogoutOutlined />}
          onClick={handleLogout}
          sx={{
            borderColor: "rgba(255, 255, 255, 0.15)",
            color: "#e2e8f0",
            fontSize: "0.8rem",
            "&:hover": {
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              borderColor: "#ef4444",
              color: "#f87171",
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Top Bar for Mobile & Desktop */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #e2e8f0",
          color: "#0f172a",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 800 }} color="text.primary">
              Instructor Dashboard
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "none",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: "100%",
          minWidth: 0,
          mt: "64px",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default TeacherLayout;
