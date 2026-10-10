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
  Tabs,
  Tab,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  AdminPanelSettings,
  School,
  WorkspacePremium,
} from "@mui/icons-material";
import { usersApi } from "../../api/users";
import { User, UserRole } from "../../api/auth";
import ConfirmDialog from "../../components/ConfirmDialog";
import CreateUserDialog from "./CreateUserDialog";

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleTab, setRoleTab] = useState<"ALL" | UserRole>("ALL");

  // Form Modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Delete Dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setFormOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await usersApi.delete(deleteId);
      setSnackbar({
        open: true,
        message: "User removed successfully",
        severity: "success",
      });
      setDeleteId(null);
      loadUsers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete user",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleTab === "ALL" || u.role === roleTab;
      return matchSearch && matchRole;
    });
  }, [users, search, roleTab]);

  return (
    <Box>
      {/* Title & Action Bar */}
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
            Users Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            Manage system administrators, teachers, and enrolled students.
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
            Add New User
          </Button>
        </Box>
      </Box>

      {/* Filter Tabs and Search Bar */}
      <Card sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          <Tabs
            value={roleTab}
            onChange={(_, val) => setRoleTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTab-root": { fontWeight: 600, minHeight: 48, fontSize: { xs: "0.8rem", sm: "0.875rem" } },
            }}
          >
            <Tab label={`All Users (${users.length})`} value="ALL" />
            <Tab
              label={`Admins (${users.filter((u) => u.role === "SUPER_ADMIN").length})`}
              value="SUPER_ADMIN"
            />
            <Tab
              label={`Teachers (${users.filter((u) => u.role === "TEACHER").length})`}
              value="TEACHER"
            />
            <Tab
              label={`Students (${users.filter((u) => u.role === "STUDENT").length})`}
              value="STUDENT"
            />
          </Tabs>

          <TextField
            size="small"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: { md: 280 } }}
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
        </Box>
      </Card>

      {/* Mobile User Card View */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
        {loading ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Loading users...
            </Typography>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No users match the search criteria.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filteredUsers.map((u) => (
              <Card key={u._id} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        fontWeight: 700,
                        flexShrink: 0,
                        bgcolor:
                          u.role === "SUPER_ADMIN"
                            ? "#7c3aed"
                            : u.role === "TEACHER"
                            ? "#10b981"
                            : "#3b82f6",
                      }}
                    >
                      {u.name.charAt(0)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="text.primary" noWrap>
                        {u.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }} noWrap>
                        {u.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={
                      u.role === "SUPER_ADMIN" ? (
                        <AdminPanelSettings fontSize="small" />
                      ) : u.role === "TEACHER" ? (
                        <WorkspacePremium fontSize="small" />
                      ) : (
                        <School fontSize="small" />
                      )
                    }
                    label={
                      u.role === "SUPER_ADMIN"
                        ? "Admin"
                        : u.role === "TEACHER"
                        ? "Teacher"
                        : "Student"
                    }
                    size="small"
                    color={
                      u.role === "SUPER_ADMIN"
                        ? "secondary"
                        : u.role === "TEACHER"
                        ? "success"
                        : "primary"
                    }
                    sx={{ fontWeight: 700, fontSize: "0.72rem", flexShrink: 0 }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="caption" color="text.secondary">
                    Registered: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recently"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Tooltip title="Edit User">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenEdit(u)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteId(u._id)}
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

      {/* Desktop Users Table */}
      <Card sx={{ display: { xs: "none", md: "block" }, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Registered</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users match the search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow key={u._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontWeight: 700,
                            bgcolor:
                              u.role === "SUPER_ADMIN"
                                ? "#7c3aed"
                                : u.role === "TEACHER"
                                ? "#10b981"
                                : "#3b82f6",
                          }}
                        >
                          {u.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
                            {u.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {u.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          u.role === "SUPER_ADMIN" ? (
                            <AdminPanelSettings fontSize="small" />
                          ) : u.role === "TEACHER" ? (
                            <WorkspacePremium fontSize="small" />
                          ) : (
                            <School fontSize="small" />
                          )
                        }
                        label={
                          u.role === "SUPER_ADMIN"
                            ? "Super Admin"
                            : u.role === "TEACHER"
                            ? "Teacher"
                            : "Student"
                        }
                        size="small"
                        color={
                          u.role === "SUPER_ADMIN"
                            ? "secondary"
                            : u.role === "TEACHER"
                            ? "success"
                            : "primary"
                        }
                        sx={{ fontWeight: 700, pl: 0.5 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "Recently"}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit User">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEdit(u)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => setDeleteId(u._id)}
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

      {/* Add / Edit User Modal */}
      {/* Add / Edit User Modal */}
      <CreateUserDialog
        open={formOpen}
        user={editingUser}
        defaultRole="STUDENT"
        onClose={() => setFormOpen(false)}
        onSuccess={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "success",
          });
          loadUsers();
        }}
        onError={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "error",
          });
        }}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete User"
        message="Are you sure you want to remove this user? Their account access will be immediately revoked."
        confirmText="Delete User"
        loading={deleteLoading}
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteId(null)}
      />

      {/* Notification Toast */}
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

export default AdminUsers;
