import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "error" | "primary" | "secondary" | "warning";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  confirmColor = "error",
  loading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1, maxWidth: 440 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText color="text.secondary">{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
