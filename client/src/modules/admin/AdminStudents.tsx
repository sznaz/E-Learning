import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  School,
  CheckCircle,
} from "@mui/icons-material";
import { usersApi } from "../../api/users";
import { User } from "../../api/auth";
import ConfirmDialog from "../../components/ConfirmDialog";
import CreateStudentDialog from "./CreateStudentDialog";

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadStudents = async () => {
    try {
      setLoading(true);
      const allUsers = await usersApi.getAll({ role: "STUDENT" });
      setStudents(allUsers.filter((u) => u.role === "STUDENT"));
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load students",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (student: User) => {
    setEditingStudent(student);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await usersApi.delete(deleteId);
      setSnackbar({
        open: true,
        message: "Student record removed",
        severity: "success",
      });
      setDeleteId(null);
      loadStudents();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete student",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

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
          mb: 4,
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
            sx={{ fontWeight: 800, fontSize: { xs: "1.45rem", sm: "1.85rem", md: "2.125rem" } }}
            color="text.primary"
          >
            Students Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            View registered learners, manage enrollment accounts, and track status.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            fullWidth
            sx={{ whiteSpace: "nowrap" }}
          >
            Add Student
          </Button>
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={{ xs: 1.5, sm: 2.5 }} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <Card
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: { xs: 2, sm: 2.5 },
                bgcolor: "rgba(79, 70, 229, 0.1)",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                "& svg": { fontSize: { xs: 20, sm: 26 } },
              }}
            >
              <School />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.125rem" } }}>
                {students.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} noWrap>
                Enrolled Students
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <Card
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: { xs: 2, sm: 2.5 },
                bgcolor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                "& svg": { fontSize: { xs: 20, sm: 26 } },
              }}
            >
              <CheckCircle />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.125rem" } }}>
                100%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} noWrap>
                Active Status
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Card sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Filter students by name or email address..."
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

      {/* Mobile Student Card View */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
        {loading ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Loading students...
            </Typography>
          </Card>
        ) : filtered.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No students found matching your query.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filtered.map((s) => (
              <Card key={s._id} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#3b82f6",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {s.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="text.primary" noWrap>
                        {s.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                        {s.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 700, fontSize: "0.72rem", flexShrink: 0 }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" color="text.secondary">
                    Enrolled: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Active"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit Student">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEdit(s)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Student">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(s._id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Desktop Students Table */}
      <Card sx={{ display: { xs: "none", md: "block" }, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Enrolled Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading students...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No students found matching your query.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((s) => (
                  <TableRow key={s._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "#3b82f6",
                            fontWeight: 700,
                          }}
                        >
                          {s.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
                            {s.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {s.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Active"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {s.createdAt
                          ? new Date(s.createdAt).toLocaleDateString()
                          : "Active"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Student">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEdit(s)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Student">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => setDeleteId(s._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add / Edit Student Dialog */}
      {/* Add / Edit Student Dialog */}
      <CreateStudentDialog
        open={formOpen}
        student={editingStudent}
        onClose={() => setFormOpen(false)}
        onSuccess={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "success",
          });
          loadStudents();
        }}
        onError={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "error",
          });
        }}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Remove Student"
        message="Are you sure you want to remove this student account? This will cancel their course enrollments."
        confirmText="Remove"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />

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

export default AdminStudents;
