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
  fixedRole?: UserRole;
  entityLabel?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({
  open,
  onClose,
  user,
  defaultRole = "STUDENT",
  fixedRole,
  entityLabel,
  onSuccess,
  onError,
}) => {
  const effectiveLabel =
    entityLabel ||
    (fixedRole === "STUDENT"
      ? "Student"
      : fixedRole === "TEACHER"
      ? "Teacher"
      : "User");

  const effectiveDefaultRole = fixedRole || defaultRole;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(effectiveDefaultRole);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
        setPassword("");
        setRole(fixedRole || user.role || effectiveDefaultRole);
      } else {
        setName("");
        setEmail("");
        setPassword("");
        setRole(effectiveDefaultRole);
      }
    }
  }, [open, user, effectiveDefaultRole, fixedRole]);

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

    const assignedRole = fixedRole || role;

    try {
      setSubmitting(true);
      setError(null);

      if (user) {
        const payload: UpdateUserPayload = {
          name: name.trim(),
          email: email.trim(),
          role: assignedRole,
          ...(password ? { password } : {}),
        };
        await usersApi.update(user._id, payload);
        const successMsg = `${effectiveLabel} updated successfully!`;
        onSuccess?.(successMsg);
      } else {
        const payload: CreateUserPayload = {
          name: name.trim(),
          email: email.trim(),
          password,
          role: assignedRole,
        };
        await usersApi.create(payload);
        const successMsg = `New ${effectiveLabel.toLowerCase()} created successfully!`;
        onSuccess?.(successMsg);
      }

      onClose();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        `Failed to save ${effectiveLabel.toLowerCase()}`;
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
          {isEditing
            ? `Edit ${effectiveLabel} Details`
            : `Add New ${effectiveLabel}`}
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
            sx={{
              marginTop: 2,
            }}
            fullWidth
            label={`${effectiveLabel} Name`}
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

          {!fixedRole && (
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
          )}
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
              : `Add ${effectiveLabel}`}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const UserDialog = CreateUserDialog;
export default CreateUserDialog;
