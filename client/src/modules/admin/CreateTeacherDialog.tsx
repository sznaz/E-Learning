import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { usersApi } from "../../api/users";
import { User } from "../../api/auth";

export interface CreateTeacherDialogProps {
  open: boolean;
  onClose: () => void;
  teacher?: User | null;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const CreateTeacherDialog: React.FC<CreateTeacherDialogProps> = ({
  open,
  onClose,
  teacher,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (teacher) {
        setName(teacher.name || "");
        setEmail(teacher.email || "");
        setPassword("");
      } else {
        setName("");
        setEmail("");
        setPassword("");
      }
    }
  }, [open, teacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      const msg = "Name and email are required";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (!teacher && (!password || password.length < 6)) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (teacher && password && password.length < 6) {
      const msg = "New password must be at least 6 characters";
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (teacher) {
        await usersApi.update(teacher._id, {
          name: name.trim(),
          email: email.trim(),
          role: "TEACHER",
          ...(password ? { password } : {}),
        });
        const successMsg = "Instructor profile updated!";
        onSuccess?.(successMsg);
      } else {
        await usersApi.create({
          name: name.trim(),
          email: email.trim(),
          password,
          role: "TEACHER",
        });
        const successMsg = "New teacher added to faculty!";
        onSuccess?.(successMsg);
      }

      onClose();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save instructor";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(teacher);

  return (
    <Dialog
      open={open}
      onClose={() => !submitting && onClose()}
      maxWidth="xs"
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
          {isEditing ? "Edit Instructor Profile" : "Add Faculty Instructor"}
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
            label="Instructor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
          <TextField
            fullWidth
            label={isEditing ? "Change Password (optional)" : "Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditing}
            disabled={submitting}
            helperText={
              isEditing
                ? "Leave blank to keep password"
                : "Minimum 6 characters"
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEditing
              ? "Update Instructor"
              : "Add Instructor"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const TeacherDialog = CreateTeacherDialog;
export default CreateTeacherDialog;
