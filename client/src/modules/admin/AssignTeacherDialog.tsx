import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import { School, PersonAddAlt1 } from "@mui/icons-material";
import { User } from "../../api/auth";
import { usersApi } from "../../api/users";
import { teacherStudentsApi } from "../../api/teacherStudents";

interface AssignTeacherDialogProps {
  open: boolean;
  student: User | null;
  currentTeacher?: User | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const AssignTeacherDialog: React.FC<AssignTeacherDialogProps> = ({
  open,
  student,
  currentTeacher,
  onClose,
  onSuccess,
  onError,
}) => {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedTeacherId(currentTeacher?._id || "");
      setFormError(null);
      fetchTeachers();
    }
  }, [open, student, currentTeacher]);

  const fetchTeachers = async () => {
    try {
      setLoadingTeachers(true);
      const allUsers = await usersApi.getAll({ role: "TEACHER" });
      const teacherUsers = allUsers.filter(
        (u) => u.role === "TEACHER" || u.role === "SUPER_ADMIN"
      );
      setTeachers(teacherUsers);
    } catch {
      setFormError("Failed to load teachers list.");
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleAssign = async () => {
    if (!student?._id) {
      setFormError("Student ID is missing.");
      return;
    }
    if (!selectedTeacherId) {
      setFormError("Please select a teacher from the dropdown.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      await teacherStudentsApi.create({
        teacher: selectedTeacherId,
        student: student._id,
      });

      const selectedTeacher = teachers.find((t) => t._id === selectedTeacherId);
      const teacherName = selectedTeacher ? selectedTeacher.name : "Teacher";

      onSuccess(
        `Successfully assigned ${teacherName} to ${student.name}!`
      );
      onClose();
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Failed to assign teacher to student.";
      setFormError(errMsg);
      onError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: "rgba(99, 102, 241, 0.12)",
              color: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PersonAddAlt1 fontSize="small" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {currentTeacher ? "Reassign Teacher" : "Assign Teacher"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentTeacher
                ? "Select a new faculty teacher for this student"
                : "Connect a faculty teacher to this student"}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        {formError && (
          <Alert
            severity="error"
            sx={{ mb: 2.5, borderRadius: 2 }}
            onClose={() => setFormError(null)}
          >
            {formError}
          </Alert>
        )}

        {/* Student Profile Card */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "#f8fafc",
            borderRadius: 2.5,
            border: "1px solid #e2e8f0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 44,
                height: 44,
                bgcolor: "#3b82f6",
                fontWeight: 700,
              }}
            >
              {student.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                {student.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Student Email: {student.email}
              </Typography>
            </Box>
          </Box>

          {currentTeacher && (
            <Box
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: "1px dashed #cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Currently Assigned:
              </Typography>
              <Chip
                icon={<School sx={{ fontSize: "14px !important" }} />}
                label={currentTeacher.name}
                size="small"
                sx={{
                  bgcolor: "rgba(124, 58, 237, 0.1)",
                  color: "#7c3aed",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                }}
              />
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Teacher Selection Dropdown */}
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Select Faculty / Teacher
        </Typography>

        {loadingTeachers ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              Loading faculty teachers...
            </Typography>
          </Box>
        ) : teachers.length === 0 ? (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            No teachers found in the system. Please add a teacher first.
          </Alert>
        ) : (
          <FormControl fullWidth size="medium">
            <InputLabel id="select-teacher-label">Select Teacher</InputLabel>
            <Select
              labelId="select-teacher-label"
              id="select-teacher"
              value={selectedTeacherId}
              label="Select Teacher"
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              sx={{ borderRadius: 2.5 }}
            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      py: 0.5,
                      width: "100%",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: "#10b981",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {teacher.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {teacher.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {teacher.email}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, borderTop: "1px solid #f1f5f9" }}>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={submitting || !selectedTeacherId || loadingTeachers}
          startIcon={
            submitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <School />
            )
          }
          sx={{
            borderRadius: 2.5,
            fontWeight: 700,
            px: 3,
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          }}
        >
          {submitting
            ? "Saving..."
            : currentTeacher
            ? "Reassign Teacher"
            : "Assign Teacher"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTeacherDialog;
