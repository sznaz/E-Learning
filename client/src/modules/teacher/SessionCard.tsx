import React from "react";
import {
  Card,
  Box,
  Typography,
  Button,
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  RadioButtonChecked,
  Edit,
  Delete,
  CalendarMonth,
  AccessTime,
  PlayArrow,
  CheckCircle,
  VideoCameraFront,
  OpenInNew,
} from "@mui/icons-material";
import { Session, SessionStatus } from "../../api/sessions";

export const STATUS_COLORS: Record<
  SessionStatus,
  "primary" | "success" | "warning" | "error" | "default"
> = {
  SCHEDULED: "primary",
  LIVE: "success",
  COMPLETED: "default",
  CANCELLED: "error",
};

export interface SessionCardProps {
  session: Session;
  onEdit?: (session: Session) => void;
  onDelete?: (sessionId: string) => void;
  onStatusChange?: (session: Session, newStatus: SessionStatus) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);
  const isLive = session.status === "LIVE";

  return (
    <Card
      sx={{
        borderRadius: 3.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        border: isLive
          ? "2px solid #10b981"
          : "1px solid rgba(226, 232, 240, 0.9)",
        boxShadow: isLive
          ? "0 8px 24px rgba(16, 185, 129, 0.2)"
          : "0 4px 14px rgba(0,0,0,0.04)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Top Status Banner */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f1f5f9",
          bgcolor: isLive ? "rgba(16, 185, 129, 0.05)" : "transparent",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={session.status}
            size="small"
            color={STATUS_COLORS[session.status]}
            icon={isLive ? <RadioButtonChecked sx={{ fontSize: 14 }} /> : undefined}
            sx={{
              fontWeight: 800,
              fontSize: "0.72rem",
              letterSpacing: "0.03em",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          {onEdit && (
            <Tooltip title="Edit Session">
              <IconButton
                size="small"
                color="primary"
                onClick={() => onEdit(session)}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete Session">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(session._id)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Body Content */}
      <Box sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.05rem", sm: "1.15rem", md: "1.25rem" },
            lineHeight: 1.3,
            mb: 1,
            color: "text.primary",
            wordBreak: "break-word",
          }}
        >
          {session.title}
        </Typography>

        {session.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {session.description}
          </Typography>
        )}

        {/* Schedule Time Details */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CalendarMonth sx={{ fontSize: 18, color: "#6366f1" }} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {startDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime sx={{ fontSize: 18, color: "#10b981" }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
              {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
              {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Typography>
          </Box>
        </Box>

        {/* Status Toggle buttons */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, mt: "auto" }}>
          {session.status === "SCHEDULED" && onStatusChange && (
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="success"
              startIcon={<PlayArrow />}
              onClick={() => onStatusChange(session, "LIVE")}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Start Class (Live)
            </Button>
          )}
          {session.status === "LIVE" && onStatusChange && (
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<CheckCircle />}
              onClick={() => onStatusChange(session, "COMPLETED")}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Mark as Completed
            </Button>
          )}
        </Box>

        {/* Join Meeting CTA */}
        <Button
          fullWidth
          variant="contained"
          component="a"
          href={session.meetingLink}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<VideoCameraFront />}
          endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
          sx={{
            py: 1.2,
            borderRadius: 2.5,
            fontWeight: 800,
            background: isLive
              ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
              : "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
            boxShadow: isLive
              ? "0 4px 14px rgba(16, 185, 129, 0.35)"
              : "0 4px 14px rgba(79, 70, 229, 0.25)",
            "&:hover": {
              background: isLive
                ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                : "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",
            },
          }}
        >
          {isLive ? "Join Live Class Now" : "Launch Meeting Room"}
        </Button>
      </Box>
    </Card>
  );
};

export const TeacherSessionCard = SessionCard;
export default SessionCard;
