import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  VideoCameraFront,
  School,
  Add,
  RadioButtonChecked,
  MenuBook,
  PeopleAlt,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { sessionsApi, Session } from "../../api/sessions";
import { usersApi } from "../../api/users";
import { coursesApi, Course } from "../../api/courses";
import { User } from "../../api/auth";

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sessData, studentsData, coursesData] = await Promise.all([
          sessionsApi.getAll(),
          usersApi.getAll({ role: "STUDENT" }),
          coursesApi.getAll(),
        ]);
        setSessions(sessData);
        setStudents(studentsData.filter((u) => u.role === "STUDENT"));
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const liveSession = sessions.find((s) => s.status === "LIVE");

  if(loading){
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Hero Banner */}
      <Card
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0d9488 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
          <Chip
            label="FACULTY PORTAL"
            size="small"
            sx={{
              bgcolor: "rgba(45, 212, 191, 0.2)",
              color: "#2dd4bf",
              fontWeight: 800,
              fontSize: "0.75rem",
              mb: 1.5,
              border: "1px solid rgba(45, 212, 191, 0.3)",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 1,
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.8rem", sm: "2.4rem" },
            }}
          >
            Welcome back, {user?.name || "Professor"}!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.82)",
              mb: 3,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
            }}
          >
            Manage your live classrooms, connect with your students, and inspire learning today.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<School />}
              component={RouterLink}
              to="/teacher/students"
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                fontWeight: 700,
                borderRadius: 2.5,
                "&:hover": {
                  borderColor: "#ffffff",
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              View Students ({students.length})
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Metrics Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: "rgba(16, 185, 129, 0.12)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideoCameraFront />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {sessions.filter((s) => s.status === "SCHEDULED").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Sessions
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: "rgba(34, 197, 94, 0.12)",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RadioButtonChecked />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: liveSession ? "#16a34a" : "inherit" }}>
                {sessions.filter((s) => s.status === "LIVE").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Live Now
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: "rgba(59, 130, 246, 0.12)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PeopleAlt />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {students.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enrolled Students
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: "rgba(168, 85, 247, 0.12)",
                color: "#a855f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MenuBook />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {courses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available Courses
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
};

export default TeacherDashboard;
