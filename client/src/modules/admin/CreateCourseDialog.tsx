import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { coursesApi, Course } from "../../api/courses";

export const COURSE_LEVELS: Course["level"][] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
];

export interface CreateCourseDialogProps {
  open: boolean;
  onClose: () => void;
  course?: Course | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const CreateCourseDialog: React.FC<CreateCourseDialogProps> = ({
  open,
  onClose,
  course,
  onSuccess,
  onError,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<Course["level"]>("Beginner");
  const [language, setLanguage] = useState("English");
  const [price, setPrice] = useState<number>(49.99);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (course) {
        setTitle(course.title || "");
        setDescription(course.description || "");
        setLevel(course.level || "Beginner");
        setLanguage(course.language || "English");
        setPrice(course.price ?? 0);
      } else {
        setTitle("");
        setDescription("");
        setLevel("Beginner");
        setLanguage("English");
        setPrice(49.99);
      }
    }
  }, [open, course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      const msg = "Title and description are required";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (price < 0) {
      const msg = "Price cannot be negative";
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        title: title.trim(),
        description: description.trim(),
        level,
        language: language.trim() || "English",
        price: Number(price),
      };

      if (course) {
        await coursesApi.update(course._id, payload);
        const successMsg = "Course updated successfully!";
        onSuccess?.(successMsg);
      } else {
        await coursesApi.create(payload);
        const successMsg = "New course created successfully!";
        onSuccess?.(successMsg);
      }

      onClose();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save course";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(course);

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            p: { xs: 0.5, sm: 1 },
            m: { xs: 1.5, sm: 3 },
          },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {isEditing ? "Edit Course" : "Create New Course"}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
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
            fullWidth
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            required
            disabled={submitting}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth disabled={submitting}>
              <InputLabel>Difficulty Level</InputLabel>
              <Select
                value={level}
                label="Difficulty Level"
                onChange={(e) => setLevel(e.target.value as Course["level"])}
              >
                {COURSE_LEVELS.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>
                    {lvl}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={submitting}
            />
            <TextField
              fullWidth
              label="Price (USD)"
              type="number"
              slotProps={{
                htmlInput: { min: 0, step: "0.01" },
              }}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              disabled={submitting}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting
              ? "Saving..."
              : isEditing
              ? "Update Course"
              : "Create Course"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const CourseDialog = CreateCourseDialog;
export default CreateCourseDialog;
