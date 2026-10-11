import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { PeopleAlt, MenuBook } from "@mui/icons-material";
import { sessionsApi, Session, CreateSessionPayload } from "../../api/sessions";
import { coursesApi, Course } from "../../api/courses";
import { teacherStudentsApi, TeacherStudent } from "../../api/teacherStudents";
import { useAuth } from "../../context/AuthContext";

export interface CreateSessionDialogProps {
  open: boolean;
  onClose: () => void;
  session?: Session | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const CreateSessionDialog: React.FC<CreateSessionDialogProps> = ({
  open,
  onClose,
  session,
  onSuccess,
  onError,
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Courses and My Students options
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          setLoadingData(true);
          const coursesList = await coursesApi.getAll();
          setCourses(coursesList);
        } catch (err) {
          console.error("Failed to load courses", err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setError(null);
      if (session) {
        setTitle(session.title || "");
        setDescription(session.description || "");

        const existingCourse =
          typeof session.course === "object"
            ? session.course?._id
            : session.course || "";
        setCourseId(existingCourse);

        const sDate = new Date(session.startTime);
        const eDate = new Date(session.endTime);

        setStartTime(
          !isNaN(sDate.getTime())
            ? new Date(sDate.getTime() - sDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)
            : "",
        );
        setEndTime(
          !isNaN(eDate.getTime())
            ? new Date(eDate.getTime() - eDate.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)
            : "",
        );
        setMeetingLink(session.meetingLink || "");
      } else {
        setTitle("");
        setDescription("");
        setCourseId("");

        // Default start time: 1 hour from now formatted for datetime-local
        const now = new Date();
        now.setHours(now.getHours() + 1, 0, 0, 0);
        const startStr = new Date(
          now.getTime() - now.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 16);

        const end = new Date(now.getTime() + 60 * 60 * 1000);
        const endStr = new Date(end.getTime() - end.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);

        setStartTime(startStr);
        setEndTime(endStr);
        setMeetingLink("https://meet.google.com/new");
      }
    }
  }, [open, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !courseId ||
      !startTime ||
      !endTime ||
      !meetingLink.trim()
    ) {
      const msg =
        "Title, course, start time, end time, and meeting link are required";
      setError(msg);
      onError?.(msg);
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      const msg = "Please provide valid start and end dates/times";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (endDate <= startDate) {
      const msg = "End time must be after start time";
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload: CreateSessionPayload = {
        title: title.trim(),
        description: description.trim() || undefined,
        course: courseId,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        meetingLink: meetingLink.trim(),
        instructor: user?._id,
      };

      if (session) {
        await sessionsApi.update(session._id, payload);
        const successMsg = "Session updated successfully!";
        onSuccess?.(successMsg);
      } else {
        await sessionsApi.create(payload);
        const successMsg = "Live Session scheduled successfully!";
        onSuccess?.(successMsg);
      }

      onClose();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save session";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(session);

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {isEditing ? "Edit Session Details" : "Schedule New Live Session"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2.2, pt: 1 }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{ borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <TextField
            sx={{
              marginTop: 2,
            }}
            fullWidth
            label="Session Title"
            placeholder="e.g. Masterclass on React 19 & Next.js Q&A"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />

          {/* Course Select Dropdown */}
          <FormControl fullWidth required disabled={submitting || loadingData}>
            <InputLabel id="course-select-label">Select Course</InputLabel>
            <Select
              labelId="course-select-label"
              id="course-select"
              value={courseId}
              label="Select Course"
              onChange={(e) => setCourseId(e.target.value)}
            >
              {loadingData ? (
                <MenuItem disabled value="">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <span>Loading courses...</span>
                  </Box>
                </MenuItem>
              ) : courses.length === 0 ? (
                <MenuItem disabled value="">
                  No courses available
                </MenuItem>
              ) : (
                courses.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <MenuBook
                        sx={{ fontSize: 18, color: "text.secondary" }}
                      />
                      <span>{c.title}</span>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Description (Optional)"
            placeholder="Brief agenda or instructions for joining students..."
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Start Date & Time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                required
                disabled={submitting}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="End Date & Time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                required
                disabled={submitting}
              />
            </Grid>
          </Grid>

          <Box>
            <TextField
              fullWidth
              label="Meeting URL (Zoom, Google Meet, Teams)"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              required
              helperText="Link will be made accessible to students to attend the session"
              disabled={submitting}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            {submitting
              ? "Saving..."
              : isEditing
                ? "Update Session"
                : "Schedule Session"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const SessionDialog = CreateSessionDialog;
export default CreateSessionDialog;
