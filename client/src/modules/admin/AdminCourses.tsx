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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  MenuBook,
} from "@mui/icons-material";
import { coursesApi, Course } from "../../api/courses";
import ConfirmDialog from "../../components/ConfirmDialog";
import CreateCourseDialog, { COURSE_LEVELS } from "./CreateCourseDialog";

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  // Modal form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Delete dialog states
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Feedback Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load courses",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setFormOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await coursesApi.delete(deleteId);
      setSnackbar({
        open: true,
        message: "Course deleted successfully",
        severity: "success",
      });
      setDeleteId(null);
      loadCourses();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete course",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchLevel = selectedLevel === "ALL" || c.level === selectedLevel;
      return matchSearch && matchLevel;
    });
  }, [courses, search, selectedLevel]);

  return (
    <Box>
      {/* Title & Actions Bar */}
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
            Courses Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            Manage, create, and configure academic curriculum and courses.
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
            Create Course
          </Button>
        </Box>
      </Box>

      {/* Filter and Search Bar */}
      <Card sx={{ p: { xs: 1.5, sm: 2.5 }, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <TextField
            size="small"
            placeholder="Search courses by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1, minWidth: { sm: 240 } }}
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

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 160 } }}>
            <InputLabel>Level</InputLabel>
            <Select
              value={selectedLevel}
              label="Level"
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <MenuItem value="ALL">All Levels</MenuItem>
              {COURSE_LEVELS.map((lvl) => (
                <MenuItem key={lvl} value={lvl}>
                  {lvl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Card>

      {/* Mobile Course Cards View */}
      <Box sx={{ display: { xs: "block", md: "none" }, mb: 3 }}>
        {loading ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Loading courses...
            </Typography>
          </Card>
        ) : filteredCourses.length === 0 ? (
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No courses match your search criteria.
            </Typography>
          </Card>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filteredCourses.map((c) => (
              <Card key={c._id} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  {c.thumbnail ? (
                    <Box
                      component="img"
                      src={c.thumbnail}
                      alt={c.title}
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 2,
                        objectFit: "cover",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Avatar sx={{ width: 52, height: 52, bgcolor: "#e0e7ff", color: "#4f46e5", flexShrink: 0 }}>
                      <MenuBook />
                    </Avatar>
                  )}
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }} color="text.primary" noWrap>
                      {c.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {c.description}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={c.level}
                    size="small"
                    color={
                      c.level === "Beginner"
                        ? "info"
                        : c.level === "Intermediate"
                        ? "primary"
                        : c.level === "Advanced"
                        ? "secondary"
                        : "default"
                    }
                    variant="outlined"
                    sx={{ fontSize: "0.72rem" }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {c.language || "English"}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.main", ml: "auto" }}>
                    ${c.price?.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", pt: 1, borderTop: "1px solid", borderColor: "divider", gap: 0.5 }}>
                  <Tooltip title="Edit Course">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleOpenEdit(c)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Course">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => setDeleteId(c._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Desktop Courses Table */}
      <Card sx={{ display: { xs: "none", md: "block" }, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Course Title</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Price</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={32} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading courses...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" color="text.secondary">
                      No courses match your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((c) => (
                  <TableRow key={c._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {c.thumbnail ? (
                          <Box
                            component="img"
                            src={c.thumbnail}
                            alt={c.title}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Avatar sx={{ width: 48, height: 48, bgcolor: "#e0e7ff", color: "#4f46e5" }}>
                            <MenuBook />
                          </Avatar>
                        )}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.primary">
                            {c.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              maxWidth: 320,
                            }}
                          >
                            {c.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={c.level}
                        size="small"
                        color={
                          c.level === "Beginner"
                            ? "info"
                            : c.level === "Intermediate"
                            ? "primary"
                            : c.level === "Advanced"
                            ? "secondary"
                            : "default"
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {c.language || "English"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
                        ${c.price?.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Edit Course">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Course">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => setDeleteId(c._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add / Edit Course Modal */}
      <CreateCourseDialog
        open={formOpen}
        course={editingCourse}
        onClose={() => setFormOpen(false)}
        onSuccess={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "success",
          });
          loadCourses();
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
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will permanently remove course records."
        confirmText="Delete"
        loading={deleteLoading}
        onConfirm={handleDeleteCourse}
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

export default AdminCourses;
