import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  VideoCameraFront,
  CalendarMonth,
  AccessTime,
  RadioButtonChecked,
  Launch,
  ContentCopy,
  MenuBook,
} from "@mui/icons-material";
import { sessionsApi, Session } from "../../../../api/sessions";

export const MySessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await sessionsApi.getByMyCourses();
      setSessions(data);
    } catch (err: any) {
      console.error("Failed to fetch sessions", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load live sessions",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;

      return matchStatus;
    });
  }, [sessions, statusFilter]);

  const liveSessions = sessions.filter((s) => s.status === "LIVE");
  const scheduledSessions = sessions.filter((s) => s.status === "SCHEDULED");
  const completedSessions = sessions.filter((s) => s.status === "COMPLETED");

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setSnackbar({
      open: true,
      message: "Session link copied to clipboard!",
      severity: "success",
    });
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: d.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: dateStr, time: "" };
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8, bgcolor: "#f8fafc" }}>
      {/* Header Banner */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2563eb 100%)",
          color: "#ffffff",
          py: { xs: 5, md: 7 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800 }}>
            <Chip
              label="INTERACTIVE LIVE CLASSROOMS"
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "#bfdbfe",
                fontWeight: 700,
                letterSpacing: 1,
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2rem", sm: "2.75rem" },
                letterSpacing: "-0.02em",
                mb: 1.5,
              }}
            >
              My Live Sessions
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#cbd5e1", maxWidth: 620, fontSize: "1.05rem" }}
            >
              Join real-time lecture streams, mentorship workshops, and office
              hours with verified instructors.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ mt: -4 }}>
        {/* Metric Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              onClick={() => setStatusFilter("LIVE")}
              sx={{
                p: 3,
                borderRadius: 3.5,
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                cursor: "pointer",
                border:
                  statusFilter === "LIVE"
                    ? "2px solid #16a34a"
                    : "1px solid transparent",
                transition: "transform 0.15s ease",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    LIVE RIGHT NOW
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, mt: 0.5, color: "#16a34a" }}
                  >
                    {liveSessions.length}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#16a34a", fontWeight: 700 }}
                  >
                    Active broadcasting rooms
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2.5,
                    bgcolor: "rgba(22, 163, 74, 0.12)",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RadioButtonChecked sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              onClick={() => setStatusFilter("SCHEDULED")}
              sx={{
                p: 3,
                borderRadius: 3.5,
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                cursor: "pointer",
                border:
                  statusFilter === "SCHEDULED"
                    ? "2px solid #2563eb"
                    : "1px solid transparent",
                transition: "transform 0.15s ease",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    UPCOMING SESSIONS
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, mt: 0.5, color: "#2563eb" }}
                  >
                    {scheduledSessions.length}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#2563eb", fontWeight: 700 }}
                  >
                    Scheduled on calendar
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2.5,
                    bgcolor: "rgba(37, 99, 235, 0.12)",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CalendarMonth sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Card
              onClick={() => setStatusFilter("ALL")}
              sx={{
                p: 3,
                borderRadius: 3.5,
                boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                cursor: "pointer",
                border:
                  statusFilter === "ALL"
                    ? "2px solid #6366f1"
                    : "1px solid transparent",
                transition: "transform 0.15s ease",
                "&:hover": { transform: "translateY(-3px)" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    TOTAL SESSIONS
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, mt: 0.5, color: "#1e1b4b" }}
                  >
                    {sessions.length}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#6366f1", fontWeight: 700 }}
                  >
                    All workshops & classes
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: 2.5,
                    bgcolor: "rgba(99, 102, 241, 0.12)",
                    color: "#6366f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VideoCameraFront sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Toolbar */}
        <Card
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <Tabs
            value={statusFilter}
            onChange={(_, val) => setStatusFilter(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.92rem",
                minHeight: 40,
              },
            }}
          >
            <Tab label={`All (${sessions.length})`} value="ALL" />
            <Tab label={`Live Now (${liveSessions.length})`} value="LIVE" />
            <Tab
              label={`Upcoming (${scheduledSessions.length})`}
              value="SCHEDULED"
            />
            <Tab
              label={`Past (${completedSessions.length})`}
              value="COMPLETED"
            />
          </Tabs>
        </Card>

        {/* Sessions List / Cards */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading sessions schedule...
            </Typography>
          </Box>
        ) : sessions.length === 0 ? (
          <Card
            sx={{
              p: { xs: 4, sm: 6 },
              textAlign: "center",
              borderRadius: 3.5,
              boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "rgba(37, 99, 235, 0.1)",
                color: "#2563eb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <VideoCameraFront sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              No live sessions scheduled yet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              Your instructors will schedule interactive classes and mentoring
              rooms soon. Check back shortly!
            </Typography>
          </Card>
        ) : filteredSessions.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center", borderRadius: 3.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              No sessions found
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setStatusFilter("ALL");
              }}
              sx={{ borderRadius: 2 }}
            >
              Show All Sessions
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3.5}>
            {filteredSessions.map((session) => {
              const isLive = session.status === "LIVE";
              const isScheduled = session.status === "SCHEDULED";
              const isCompleted = session.status === "COMPLETED";

              const startObj = formatDateTime(session.startTime);
              const endObj = formatDateTime(session.endTime);
              const instructor =
                session.instructor && typeof session.instructor === "object"
                  ? (session.instructor as any)
                  : { name: "Instructor", email: "", role: "TEACHER" };

              const courseTitle =
                session.course && typeof session.course === "object"
                  ? (session.course as any).title
                  : typeof session.course === "string"
                    ? session.course
                    : null;

              return (
                <Grid size={{ xs: 12, md: 6 }} key={session._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3.5,
                      boxShadow: isLive
                        ? "0 10px 30px rgba(22, 163, 74, 0.15)"
                        : "0 6px 20px rgba(0,0,0,0.04)",
                      border: isLive
                        ? "2px solid #16a34a"
                        : "1px solid rgba(226, 232, 240, 0.9)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top status bar */}
                    {isLive && (
                      <Box
                        sx={{
                          bgcolor: "#16a34a",
                          color: "#ffffff",
                          px: 2,
                          py: 0.6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <RadioButtonChecked sx={{ fontSize: 16 }} />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: 800, letterSpacing: 0.8 }}
                          >
                            HAPPENING NOW — ROOM IS OPEN
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1, p: { xs: 2.5, sm: 3 } }}>
                      {/* Course Badge */}
                      {courseTitle && (
                        <Box sx={{ mb: 1.2 }}>
                          <Chip
                            icon={<MenuBook sx={{ fontSize: "14px !important" }} />}
                            label={courseTitle}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              bgcolor: "rgba(99, 102, 241, 0.06)",
                              borderColor: "rgba(99, 102, 241, 0.25)",
                            }}
                          />
                        </Box>
                      )}

                      {/* Header Row */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1.5,
                          gap: 1.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 800,
                            fontSize: "1.2rem",
                            lineHeight: 1.3,
                            color: "#0f172a",
                          }}
                        >
                          {session.title}
                        </Typography>

                        <Chip
                          label={session.status}
                          size="small"
                          color={
                            isLive
                              ? "success"
                              : isScheduled
                                ? "primary"
                                : "default"
                          }
                          sx={{ fontWeight: 700, fontSize: "0.72rem" }}
                        />
                      </Box>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2.5,
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {session.description ||
                          "Interactive live session covering core topics and hands-on guidance."}
                      </Typography>

                      {/* Instructor Info */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: "#f8fafc",
                          borderRadius: 2.5,
                          mb: 2.5,
                          border: "1px solid #f1f5f9",
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: "#6366f1",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                          }}
                        >
                          {(instructor?.name || "I").charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {instructor?.name || "Instructor"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Faculty Instructor •{" "}
                            {instructor?.email || "verified"}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Time & Date Row */}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mb: 2.5,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CalendarMonth
                            sx={{ fontSize: 18, color: "#6366f1" }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {startObj.date}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTime sx={{ fontSize: 18, color: "#6366f1" }} />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {startObj.time} - {endObj.time}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2.5 }} />

                      {/* Action buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {session.meetingLink ? (
                          <Button
                            variant="contained"
                            color={isLive ? "success" : "primary"}
                            href={
                              session.meetingLink.startsWith("http")
                                ? session.meetingLink
                                : `https://${session.meetingLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            endIcon={<Launch />}
                            sx={{
                              flexGrow: 1,
                              borderRadius: 2.5,
                              fontWeight: 700,
                              py: 1,
                              ...(isLive && {
                                background:
                                  "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                                boxShadow: "0 4px 15px rgba(22, 163, 74, 0.35)",
                              }),
                            }}
                          >
                            {isLive
                              ? "Join Live Classroom"
                              : "Open Meeting Room"}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            disabled
                            sx={{ flexGrow: 1, borderRadius: 2.5 }}
                          >
                            Link Pending
                          </Button>
                        )}

                        {session.meetingLink && (
                          <Tooltip title="Copy Meeting Link">
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleCopyLink(session.meetingLink)
                              }
                              sx={{
                                minWidth: 44,
                                width: 44,
                                px: 0,
                                borderRadius: 2.5,
                              }}
                            >
                              <ContentCopy fontSize="small" />
                            </Button>
                          </Tooltip>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MySessionsPage;
