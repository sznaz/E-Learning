import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add,
  VideoCameraFront,
  CalendarMonth,
  CheckCircle,
  RadioButtonChecked,
} from "@mui/icons-material";
import { sessionsApi, Session, SessionStatus } from "../../api/sessions";
import ConfirmDialog from "../../components/ConfirmDialog";
import CreateSessionDialog from "./CreateSessionDialog";
import SessionCard from "./SessionCard";

export const TeacherSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Create / Edit Dialog
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const loadData = async () => {
    try {
      setLoading(true);
      const sessionsData = await sessionsApi.getByInstructor();
      setSessions(sessionsData);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load sessions data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSession(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (s: Session) => {
    setEditingSession(s);
    setModalOpen(true);
  };

  const handleQuickStatusChange = async (s: Session, newStatus: SessionStatus) => {
    try {
      await sessionsApi.update(s._id, { status: newStatus });
      setSnackbar({
        open: true,
        message: `Session status marked as ${newStatus}`,
        severity: "success",
      });
      loadData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to update status",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      await sessionsApi.delete(deleteId);
      setSnackbar({
        open: true,
        message: "Session deleted",
        severity: "success",
      });
      setDeleteId(null);
      loadData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to delete session",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Metrics
  const scheduledCount = sessions.filter((s) => s.status === "SCHEDULED").length;
  const liveCount = sessions.filter((s) => s.status === "LIVE").length;
  const completedCount = sessions.filter((s) => s.status === "COMPLETED").length;
  const cancelledCount = sessions.filter((s) => s.status === "CANCELLED").length;

  // Filter sessions by status
  const filteredSessions = sessions.filter((s) => {
    if (statusFilter === "ALL") return true;
    return s.status === statusFilter;
  });

  return (
    <Box>
      {/* Page Title & Actions */}
      <Box
        sx={{
          mb: { xs: 2.5, sm: 4 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.45rem", sm: "1.75rem", md: "2.125rem" },
              letterSpacing: "-0.02em",
            }}
            color="text.primary"
          >
            Live Sessions & Mentoring
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontSize: { xs: "0.85rem", sm: "0.875rem" } }}
          >
            Schedule interactive classes, invite students, and conduct real-time learning sessions.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Add />}
            onClick={() => handleOpenCreate()}
            sx={{
              width: { xs: "100%", sm: "auto" },
              py: { xs: 1.2, sm: 1 },
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              },
            }}
          >
            Create New Session
          </Button>
        </Box>
      </Box>

      {/* Metrics Row */}
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card
            onClick={() => setStatusFilter("ALL")}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              cursor: "pointer",
              border: statusFilter === "ALL" ? "2px solid #6366f1" : "1px solid rgba(226, 232, 240, 0.8)",
              transition: "transform 0.15s ease",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}
                >
                  ALL SESSIONS
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, mt: 0.5, fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" } }}
                >
                  {sessions.length}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: 2,
                  bgcolor: "rgba(99, 102, 241, 0.12)",
                  color: "#6366f1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VideoCameraFront sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card
            onClick={() => setStatusFilter("SCHEDULED")}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              cursor: "pointer",
              border: statusFilter === "SCHEDULED" ? "2px solid #2563eb" : "1px solid rgba(226, 232, 240, 0.8)",
              transition: "transform 0.15s ease",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}
                >
                  SCHEDULED
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mt: 0.5,
                    color: "#2563eb",
                    fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {scheduledCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: 2,
                  bgcolor: "rgba(37, 99, 235, 0.12)",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarMonth sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card
            onClick={() => setStatusFilter("LIVE")}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              cursor: "pointer",
              border: statusFilter === "LIVE" ? "2px solid #16a34a" : "1px solid rgba(226, 232, 240, 0.8)",
              transition: "transform 0.15s ease",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}
                >
                  LIVE
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mt: 0.5,
                    color: "#16a34a",
                    fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {liveCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: 2,
                  bgcolor: "rgba(22, 163, 74, 0.12)",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RadioButtonChecked sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <Card
            onClick={() => setStatusFilter("COMPLETED")}
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              cursor: "pointer",
              border: statusFilter === "COMPLETED" ? "2px solid #64748b" : "1px solid rgba(226, 232, 240, 0.8)",
              transition: "transform 0.15s ease",
              "&:hover": { transform: "translateY(-2px)" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, fontSize: { xs: "0.68rem", sm: "0.75rem" } }}
                >
                  COMPLETED
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mt: 0.5,
                    color: "#64748b",
                    fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.125rem" },
                  }}
                >
                  {completedCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 36, sm: 44 },
                  height: { xs: 36, sm: 44 },
                  borderRadius: 2,
                  bgcolor: "rgba(100, 116, 139, 0.12)",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Tabs & Search */}
      <Card sx={{ p: { xs: 1, sm: 1.5 }, mb: 3, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12 }}>
            <Tabs
              value={statusFilter}
              onChange={(_, val) => setStatusFilter(val)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: { xs: "0.82rem", sm: "0.9rem" },
                  minHeight: 40,
                  px: { xs: 1.5, sm: 2 },
                },
              }}
            >
              <Tab label={`All (${sessions.length})`} value="ALL" />
              <Tab label={`Scheduled (${scheduledCount})`} value="SCHEDULED" />
              <Tab label={`Live Now (${liveCount})`} value="LIVE" />
              <Tab label={`Completed (${completedCount})`} value="COMPLETED" />
              <Tab label={`Cancelled (${cancelledCount})`} value="CANCELLED" />
            </Tabs>
          </Grid>
        </Grid>
      </Card>

      {/* Session Cards Grid */}
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
          <CircularProgress size={36} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading live sessions...
          </Typography>
        </Box>
      ) : sessions.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <VideoCameraFront sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No sessions found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: "auto", mt: 1, mb: 3 }}>
            You haven't scheduled any sessions yet. Click the button below to organize a live lecture or 1:1 mentoring call with your students.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenCreate()}
            sx={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            Schedule Your First Session
          </Button>
        </Card>
      ) : filteredSessions.length === 0 ? (
        <Card sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(100, 116, 139, 0.1)",
              color: "text.secondary",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <VideoCameraFront sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            No {statusFilter.toLowerCase()} sessions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: "auto", mt: 1, mb: 2.5 }}>
            There are currently no sessions with the "{statusFilter}" status.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setStatusFilter("ALL")}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            View All Sessions
          </Button>
        </Card>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {filteredSessions.map((s) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={s._id}>
              <SessionCard
                session={s}
                onEdit={handleOpenEdit}
                onDelete={(id) => setDeleteId(id)}
                onStatusChange={handleQuickStatusChange}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Schedule / Edit Session Modal Dialog */}
      <CreateSessionDialog
        open={modalOpen}
        session={editingSession}
        onClose={() => setModalOpen(false)}
        onSuccess={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "success",
          });
          loadData();
        }}
        onError={(msg) => {
          setSnackbar({
            open: true,
            message: msg,
            severity: "error",
          });
        }}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete Session"
        message="Are you sure you want to cancel and delete this live session? Enrolled students will no longer be able to access the room."
        confirmText="Delete Session"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />

      {/* Snackbar */}
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

export default TeacherSessions;
