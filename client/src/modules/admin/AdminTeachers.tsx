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
  WorkspacePremium,
  Star,
  CastForEducation,
} from "@mui/icons-material";
import { usersApi } from "../../api/users";
import { User } from "../../api/auth";
import ConfirmDialog from "../../components/ConfirmDialog";
import CreateTeacherDialog from "./CreateTeacherDialog";

export const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<User | null>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const allUsers = await usersApi.getAll({ role: "TEACHER" });
      setTeachers(allUsers.filter((u) => u.role === "TEACHER"));
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load teachers",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (t: User) => {
    setEditingTeacher(t);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await usersApi.delete(deleteId);
      setSnackbar({
        open: true,
        message: "Teacher account removed from faculty",
        severity: "success",
      });
      setDeleteId(null);
      loadTeachers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete teacher",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return teachers.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [teachers, search]);

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
            Teachers & Faculty Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            Manage academic instructors, course creators, and teaching faculty.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={handleOpenAdd}
            fullWidth
            sx={{
              whiteSpace: "nowrap",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            Add Instructor
          </Button>
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={{ xs: 1.5, sm: 2.5 }} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
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
              <WorkspacePremium />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2.125rem" } }}>
                {teachers.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }} noWrap>
                Certified Instructors
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
          placeholder="Filter instructors by name or email address..."
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

      {/* Mobile Teacher Card View */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
        {loading ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Loading teachers...
            </Typography>
          </Card>
        ) : filtered.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No instructors found matching your query.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filtered.map((t) => (
              <Card key={t._id} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#10b981",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {t.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="text.primary" noWrap>
                        {t.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                        {t.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={<WorkspacePremium fontSize="small" />}
                    label="TEACHER"
                    size="small"
                    color="success"
                    sx={{ fontWeight: 700, fontSize: "0.72rem", flexShrink: 0 }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" color="text.secondary">
                    Joined: {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Active"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit Instructor">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEdit(t)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Instructor">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(t._id)}
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

      {/* Desktop Teachers Table */}
      <Card sx={{ display: { xs: "none", md: "block" }, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Teacher / Instructor</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading teachers...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No instructors found matching your query.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "#10b981",
                            fontWeight: 700,
                          }}
                        >
                          {t.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
                            {t.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {t.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<WorkspacePremium fontSize="small" />}
                        label="TEACHER"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 700, pl: 0.5 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleDateString()
                          : "Active"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit Instructor">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEdit(t)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Instructor">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => setDeleteId(t._id)}
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

      {/* Add / Edit Teacher Dialog */}
      {/* Add / Edit Teacher Dialog */}
      <CreateTeacherDialog
        open={formOpen}
        teacher={editingTeacher}
        onClose={() => setFormOpen(false)}
        onSuccess={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "success",
          });
          loadTeachers();
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
        title="Remove Instructor"
        message="Are you sure you want to remove this teacher from the faculty? They will lose access to course authoring tools."
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

export default AdminTeachers;
