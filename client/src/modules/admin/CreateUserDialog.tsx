import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { usersApi, CreateUserPayload, UpdateUserPayload } from "../../api/users";
import { User, UserRole } from "../../api/auth";

export interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  user?: User | null;
  defaultRole?: UserRole;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onClose,
  user,
  defaultRole = "STUDENT",
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
        setPassword("");
        setRole(user.role || defaultRole);
      } else {
        setName("");
        setEmail("");
        setPassword("");
        setRole(defaultRole);
      }
    }
  }, [open, user, defaultRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      const msg = "Name and email are required";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (!user && (!password || password.length < 6)) {
      const msg = "Password must be at least 6 characters";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (user && password && password.length < 6) {
      const msg = "New password must be at least 6 characters";
      setError(msg);
      onError?.(msg);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (user) {
        const payload: UpdateUserPayload = {
          name: name.trim(),
          email: email.trim(),
          role,
          ...(password ? { password } : {}),
        };
        await usersApi.update(user._id, payload);
        const successMsg = "User updated successfully!";
        onSuccess?.(successMsg);
      } else {
        const payload: CreateUserPayload = {
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        };
        await usersApi.create(payload);
        const successMsg = "New user created successfully!";
        onSuccess?.(successMsg);
      }

      onClose();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || err.message || "Failed to save user";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = Boolean(user);

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
          {isEditing ? "Edit User Account" : "Create New User"}
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
            label="Full Name"
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
            label={isEditing ? "New Password (optional)" : "Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!isEditing}
            disabled={submitting}
            helperText={
              isEditing
                ? "Leave blank to keep existing password"
                : "Minimum 6 characters"
            }
          />

          <FormControl fullWidth disabled={submitting}>
            <InputLabel>User Role</InputLabel>
            <Select
              value={role}
              label="User Role"
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="TEACHER">Teacher</MenuItem>
              <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={submitting} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const UserDialog = CreateUserDialog;
export default CreateUserDialog;
