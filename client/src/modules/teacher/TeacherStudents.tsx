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
  School,
} from "@mui/icons-material";
import { teacherStudentsApi, TeacherStudent } from "../../api/teacherStudents";
import { User } from "../../api/auth";

export const TeacherStudents: React.FC = () => {
  const [assignments, setAssignments] = useState<TeacherStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await teacherStudentsApi.getAll();
      setAssignments(data);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message:
          err.response?.data?.message || "Failed to load assigned students list",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const getStudent = (rec: TeacherStudent): Partial<User> | null => {
    if (rec.student && typeof rec.student === "object") {
      return rec.student as User;
    }
    return null;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter((rec) => {
      const student = getStudent(rec);
      const studentName = student?.name || "";
      const studentEmail = student?.email || "";
      return (
        studentName.toLowerCase().includes(q) ||
        studentEmail.toLowerCase().includes(q)
      );
    });
  }, [assignments, search]);

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            <Chip
              label={`${assignments.length} Assigned`}
              size="small"
              color="primary"
              sx={{ fontWeight: 700, fontSize: "0.75rem" }}
            />
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
          >
            Review all TeacherStudent assignment records, student profiles, and allocation timestamps.
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2.5, sm: 3 }, borderRadius: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search assigned students by name or email"
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
            Loading assigned students records...
          </Typography>
        </Card>
      ) : assignments.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <School sx={{ fontSize: 48, color: "text.secondary", mb: 1, opacity: 0.6 }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No Students Assigned Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 450, mx: "auto" }}>
            You do not have any student assignments recorded in the system yet. Once an administrator assigns students to you, their TeacherStudent documents will show up here.
          </Typography>
        </Card>
      ) : filtered.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No matching students found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No assigned learners found matching "{search}".
          </Typography>
        </Card>
      ) : (
        <>
          {/* Desktop & Tablet Screen View: Multi-column Table (md and up) */}
          <Box>
            <Card sx={{ overflow: "hidden", borderRadius: 3, boxShadow: "0 4px 14px rgba(0,0,0,0.04)" }}>
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 750 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell sx={{ fontWeight: 700 }}>Student</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Assigned On</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((rec, index) => {
                      const student = getStudent(rec);
                      const studentName = student?.name || "Student";
                      const studentEmail = student?.email || "No email";
                      return (
                        <TableRow key={rec._id} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 38,
                                  height: 38,
                                  bgcolor: ["#4f46e5", "#0891b2", "#10b981", "#7c3aed", "#f59e0b"][index % 5],
                                  fontWeight: 700,
                                  fontSize: "0.92rem",
                                }}
                              >
                                {studentName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
                                  {studentName}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                              <Email sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary">
                                {studentEmail}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                              {formatDate(rec.createdAt)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {rec.createdAt ? new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
