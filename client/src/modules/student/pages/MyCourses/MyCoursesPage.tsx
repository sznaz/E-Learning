import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  LinearProgress,
  TextField,
  InputAdornment,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  School,
  PlayCircleOutlined,
  CheckCircle,
  MenuBook,
  ArrowForward,
  TrendingUp,
  WorkspacePremium,
  Translate,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { enrollmentsApi, Enrollment } from "../../../../api/enrollments";
import { Course } from "../../../../api/courses";
import CourseDetailModal from "../../../../components/CourseDetailModal";

export const MyCoursesPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<string>("ALL");

  // Selected course for detail modal
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);


  // Toast
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await enrollmentsApi.getAll();
      setEnrollments(data);
    } catch (err: any) {
      console.error("Failed to load enrollments", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to load your enrolled courses",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);


  return (
    <Box sx={{ minHeight: "100vh", pb: 8, bgcolor: "#f8fafc" }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4338ca 100%)",
          color: "#ffffff",
          py: { xs: 5, md: 7 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800 }}>
            <Chip
              label="STUDENT LEARNING DASHBOARD"
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.15)",
                color: "#c7d2fe",
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
              My Enrolled Courses
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#cbd5e1", maxWidth: 620, fontSize: "1.05rem" }}
            >
              Track your coursework, resume where you left off, and complete your roadmaps to earn industry certifications.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Container */}
      <Container maxWidth="lg" sx={{ mt:2 }}>

        {/* Course Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading your courses...
            </Typography>
          </Box>
        ) : enrollments.length === 0 ? (
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
                bgcolor: "rgba(99, 102, 241, 0.1)",
                color: "#4f46e5",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <MenuBook sx={{ fontSize: 36 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              You haven't enrolled in any courses yet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto", mb: 3 }}
            >
              Browse our catalog of in-demand tech courses, view course details, and enroll to kickstart your journey.
            </Typography>
            <Button
              component={RouterLink}
              to="/courses"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                py: 1.4,
                px: 3.5,
                borderRadius: 2.5,
                fontWeight: 700,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              }}
            >
              Explore Course Catalog
            </Button>
          </Card>
        ) : enrollments.length === 0 ? (
          <Card sx={{ p: 5, textAlign: "center", borderRadius: 3.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              No courses matching filters
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setStatusTab("ALL");
              }}
              sx={{ borderRadius: 2 }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3.5}>
            {enrollments.map((item) => {
              const course =
                item.course && typeof item.course === "object"
                  ? (item.course as Course)
                  : null;
              if (!course) return null;

              return (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3.5,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
                      overflow: "hidden",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    {/* Media */}
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="180"
                        image={
                          course.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                        }
                        alt={course.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <Chip
                        label={course.category || "General"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: "rgba(15, 23, 42, 0.85)",
                          color: "#ffffff",
                          backdropFilter: "blur(6px)",
                          fontWeight: 600,
                          fontSize: "0.72rem",
                        }}
                      />
                      <Chip
                        label={"In Progress"}
                        size="small"
                        color={"primary"}
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          fontSize: "1.1rem",
                          lineHeight: 1.35,
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.7em",
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 2,
                          fontSize: "0.85rem",
                          lineHeight: 1.5,
                        }}
                      >
                        {course.description || "Comprehensive hands-on training module."}
                      </Typography>

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          mt: 2.5,
                          pt: 1.5,
                          borderTop: "1px solid #f1f5f9",
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={() => setDetailCourse(course)}
                          sx={{ borderRadius: 2, fontWeight: 700, textTransform: "none" }}
                        >
                          Course Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={detailCourse}
        open={Boolean(detailCourse)}
        onClose={() => setDetailCourse(null)}
        isEnrolled={true}
      />

      {/* Toast Feedback */}
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

export default MyCoursesPage;
