import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import {
  Search,
  Email,
} from "@mui/icons-material";
import { usersApi } from "../../api/users";
import { User } from "../../api/auth";

export const TeacherStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadStudents = async () => {
    try {
      setLoading(true);
      const allUsers = await usersApi.getAll({ role: "STUDENT" });
      setStudents(allUsers);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load students list",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: { xs: 2.5, sm: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.45rem", sm: "1.75rem", md: "2.125rem" },
              letterSpacing: "-0.02em",
            }}
            color="text.primary"
          >
            My Students Directory
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
          >
            Manage your learners, review attendance, and schedule one-on-one or group mentoring sessions.
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2.5, sm: 3 }, borderRadius: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search students by name or email address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Card>

      {/* Loading & Empty States */}
      {loading ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <CircularProgress size={36} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading students directory...
          </Typography>
        </Card>
      ) : filtered.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No students found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No learners found matching "{search}".
          </Typography>
        </Card>
      ) : (
        <>
          {/* Mobile Screen View: Clean Student Cards (xs & sm) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1.5 }}>
            {filtered.map((s, index) => (
              <Card
                key={s._id}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  border: "1px solid #f1f5f9",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        bgcolor: ["#4f46e5", "#0891b2", "#10b981", "#7c3aed", "#f59e0b"][index % 5],
                        fontWeight: 700,
                        fontSize: "0.95rem",
                      }}
                    >
                      {s.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                        {s.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          bgcolor: "#f1f5f9",
                          px: 0.8,
                          py: 0.2,
                          borderRadius: 1,
                          fontSize: "0.72rem",
                        }}
                      >
                        STD-{s._id.slice(-6).toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
                  />
                </Box>

                <Box
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.8,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.82rem", wordBreak: "break-all" }}
                    >
                      {s.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="caption" color="text.secondary">
                      Enrolled Date:
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary" }}>
                      {s.createdAt
                        ? new Date(s.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Active"}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>

          {/* Desktop & Tablet Screen View: Multi-column Table (md and up) */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Card sx={{ overflow: "hidden", borderRadius: 3, boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 700 }}>Student Information</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Enrolled Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((s, index) => (
                      <TableRow key={s._id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: ["#4f46e5", "#0891b2", "#10b981", "#7c3aed", "#f59e0b"][index % 5],
                                fontWeight: 700,
                                fontSize: "0.95rem",
                              }}
                            >
                              {s.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
                                {s.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Active Student
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "monospace",
                              fontWeight: 700,
                              bgcolor: "#f1f5f9",
                              px: 1,
                              py: 0.4,
                              borderRadius: 1,
                            }}
                          >
                            STD-{s._id.slice(-6).toUpperCase()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {s.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Active Learner"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {s.createdAt
                              ? new Date(s.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "Active"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Box>
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TeacherStudents;
