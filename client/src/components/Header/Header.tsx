import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import {
  School,
  MenuBook,
  AdminPanelSettings,
  Logout,
  Menu as MenuIcon,
  Login as LoginIcon,
  BookmarkBorder,
  VideoCameraFront,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { authApi } from "../../api/auth";

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, isTeacher, isStudent, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    try {
      await authApi.logout();
    } catch (e) {
      console.error("Logout request failed", e);
    }
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Home", path: "/home", icon: <School fontSize="small" /> },
    { label: "Courses", path: "/courses", icon: <MenuBook fontSize="small" /> },
  ];

  if (isStudent) {
    navLinks.push(
      {
        label: "My Courses",
        path: "/my-courses",
        icon: <BookmarkBorder fontSize="small" />,
      },
      {
        label: "My Sessions",
        path: "/my-sessions",
        icon: <VideoCameraFront fontSize="small" />,
      }
    );
  }

  if (isAdmin) {
    navLinks.push({
      label: "Admin Portal",
      path: "/admin",
      icon: <AdminPanelSettings fontSize="small" />,
    });
  }

  if (isTeacher) {
    navLinks.push({
      label: "Teacher Portal",
      path: "/teacher",
      icon: <School fontSize="small" />,
    });
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e2e8f0",
        color: "#0f172a",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 0 } }}>
          {/* Brand Logo */}
          <Box
            component={RouterLink}
            to="/home"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(79, 70, 229, 0.3)",
              }}
            >
              <School fontSize="small" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.02em",
              }}
            >
              E-Learn
            </Typography>
          </Box>

          {/* Desktop Nav Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {navLinks.map((link) => {
              const isActive =
                link.path === "/home"
                  ? location.pathname === "/home" || location.pathname === "/"
                  : location.pathname.startsWith(link.path);

              return (
                <Button
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  startIcon={link.icon}
                  sx={{
                    color: isActive ? "#4f46e5" : "#475569",
                    fontWeight: isActive ? 700 : 500,
                    backgroundColor: isActive ? "rgba(79, 70, 229, 0.08)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(79, 70, 229, 0.06)",
                      color: "#4f46e5",
                    },
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          {/* Right Section: Auth State */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isAuthenticated && user ? (
              <>
                <Box
                  onClick={handleOpenUserMenu}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    cursor: "pointer",
                    p: 0.6,
                    pr: 1.5,
                    borderRadius: 3,
                    "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor:
                        user.role === "SUPER_ADMIN"
                          ? "#7c3aed"
                          : user.role === "TEACHER"
                          ? "#10b981"
                          : "#4f46e5",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role}
                    </Typography>
                  </Box>
                </Box>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseUserMenu}
                  slotProps={{
                    paper: {
                      sx: {
                        borderRadius: 3,
                        minWidth: 200,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        mt: 1,
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>

                  {isAdmin && (
                    <MenuItem
                      component={RouterLink}
                      to="/admin"
                      onClick={handleCloseUserMenu}
                    >
                      <ListItemIcon>
                        <AdminPanelSettings fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Admin Portal" />
                    </MenuItem>
                  )}

                  {isTeacher && (
                    <MenuItem
                      component={RouterLink}
                      to="/teacher"
                      onClick={handleCloseUserMenu}
                    >
                      <ListItemIcon>
                        <School fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Teacher Portal" />
                    </MenuItem>
                  )}

                  {isStudent && (
                    <>
                      <MenuItem
                        component={RouterLink}
                        to="/my-courses"
                        onClick={handleCloseUserMenu}
                      >
                        <ListItemIcon>
                          <BookmarkBorder fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="My Courses" />
                      </MenuItem>
                      <MenuItem
                        component={RouterLink}
                        to="/my-sessions"
                        onClick={handleCloseUserMenu}
                      >
                        <ListItemIcon>
                          <VideoCameraFront fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="My Sessions" />
                      </MenuItem>
                    </>
                  )}

                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: "error.main" }} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 2.5,
                  px: 2.5,
                }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile Hamburger Button */}
            <IconButton
              sx={{ display: { md: "none" } }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Nav Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, px: 2 }}>
            E-Learn Navigation
          </Typography>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;