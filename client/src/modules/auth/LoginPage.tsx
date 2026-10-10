import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  School,
  LockOutlined,
  EmailOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../api/auth";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useAuth();

  const [tab, setTab] = useState<0 | 1>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const from = (location.state as any)?.from?.pathname;

  const handleRedirect = (userRole?: string) => {
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === "SUPER_ADMIN") {
      navigate("/admin", { replace: true });
    } else if (userRole === "TEACHER") {
      navigate("/teacher", { replace: true });
    } else {
      navigate("/courses", { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    try {
      if (tab === 0) {
        if (!email || !password) {
          setErrorMsg("Please fill in both email and password.");
          return;
        }
        await login({ email, password });
        // Retrieve updated user to redirect
        const saved = localStorage.getItem("user");
        const parsed = saved ? JSON.parse(saved) : null;
        handleRedirect(parsed?.role);
      } else {
        if (!name || !email || !password) {
          setErrorMsg("Please fill in all required fields.");
          return;
        }
        if (password.length < 6) {
          setErrorMsg("Password must be at least 6 characters.");
          return;
        }
        await register({ name, email, password, role: "STUDENT" });
        const saved = localStorage.getItem("user");
        const parsed = saved ? JSON.parse(saved) : null;
        handleRedirect(parsed?.role);
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "An error occurred. Please verify your credentials.";
      setErrorMsg(msg);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.08) 0%, rgba(248, 250, 252, 0.95) 90%)",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                mb: 2,
                boxShadow: "0 8px 16px rgba(79, 70, 229, 0.3)",
              }}
            >
              <School sx={{ fontSize: 30 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800 }}
              color="text.primary"
            >
              Welcome to E-Learn
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              The modern learning platform for ambitious minds
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, val) => {
              setTab(val);
              setErrorMsg(null);
            }}
            variant="fullWidth"
            sx={{
              mb: 3,
              borderBottom: "1px solid #e2e8f0",
              "& .MuiTab-root": { fontWeight: 600, py: 1.5 },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlined color="action" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: tab === 1 ? 2 : 3 }}>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.4,
                fontSize: "1rem",
                borderRadius: 2.5,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : tab === 0 ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
