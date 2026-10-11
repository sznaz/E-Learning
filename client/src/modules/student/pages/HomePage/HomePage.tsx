import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  MenuBook,
  WorkspacePremium,
  ArrowForward,
  AdminPanelSettings,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { coursesApi, Course } from "../../../../api/courses";
import { useAuth } from "../../../../context/AuthContext";
import CourseDetailModal from "../../../../components/CourseDetailModal";

export const HomePage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set()
  );
  const [enrolledNotice, setEnrolledNotice] = useState<string | null>(null);

  useEffect(() => {
    coursesApi.getAll().then((data) => {
      setFeaturedCourses(data.slice(0, 3));
    });
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
          color: "#ffffff",
          py: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="NEXT-GENERATION ONLINE EDUCATION"
                size="small"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.2)",
                  color: "#a5b4fc",
                  fontWeight: 700,
                  letterSpacing: 1,
                  mb: 2.5,
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                  letterSpacing: "-0.03em",
                }}
              >
                Learn Without Limits.{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #818cf8 0%, #c084fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Master In-Demand Skills.
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "#cbd5e1",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: 4,
                  maxWidth: 580,
                }}
              >
                Access university-grade curriculum in Full-Stack Development, Machine Learning, Cloud Architecture, and Cybersecurity.
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Button
                  component={RouterLink}
                  to="/courses"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.6,
                    px: 3.5,
                    fontSize: "1.05rem",
                    borderRadius: 3,
                  }}
                >
                  Explore All Courses
                </Button>
                {isAdmin && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<AdminPanelSettings />}
                    sx={{
                      py: 1.6,
                      px: 3,
                      borderRadius: 3,
                    }}
                  >
                    Admin Dashboard
                  </Button>
                )}
              </Box>

              {/* Trust Badges */}
              <Box sx={{ display: "flex", gap: 4, mt: 5, pt: 4, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }} color="#ffffff">
                    100+
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Expert Modules
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }} color="#ffffff">
                    15,000+
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Active Students
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }} color="#ffffff">
                    4.9 / 5
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                    Average Rating
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Hero Visual Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: 4,
                  p: 3,
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
              >
                <Typography variant="subtitle2" sx={{ color: "#818cf8", mb: 2, fontWeight: 700 }}>
                  ✦ PLATFORM HIGHLIGHTS
                </Typography>
                {[
                  {
                    title: "Live & Self-Paced Courses",
                    desc: "Interactive curriculum taught by verified faculty with real-time feedback.",
                    icon: <MenuBook sx={{ color: "#818cf8" }} />,
                  },
                  {
                    title: "World-Class Educators",
                    desc: "Instructors from top research institutes and leading tech companies.",
                    icon: <WorkspacePremium sx={{ color: "#34d399" }} />,
                  },
                  {
                    title: "Robust Admin Management",
                    desc: "Complete administration tools to manage courses, students, and teachers.",
                    icon: <AdminPanelSettings sx={{ color: "#c084fc" }} />,
                  },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      gap: 2,
                      p: 2,
                      mb: idx !== 2 ? 1.5 : 0,
                      borderRadius: 3,
                      bgcolor: "rgba(255, 255, 255, 0.03)",
                    }}
                  >
                    <Box sx={{ mt: 0.5 }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="#ffffff">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Courses Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="caption" color="primary" sx={{ fontWeight: 800, letterSpacing: 1 }}>
              POPULAR CHOICES
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Featured Masterclasses
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/courses"
            endIcon={<ArrowForward />}
            sx={{ fontWeight: 700 }}
          >
            Browse All Courses
          </Button>
        </Box>

        <Grid container spacing={3.5}>
          {featuredCourses.map((c) => (
            <Grid key={c._id} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="190"
                  image={
                    c.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                  }
                  alt={c.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Chip label={c.category} size="small" variant="outlined" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }} color="primary.main">
                      ${c.price?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, minHeight: "2.6em" }}>
                    {c.title}
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
                    }}
                  >
                    {c.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setActiveCourse(c)}
                    sx={{ mt: "auto", borderRadius: 2, fontWeight: 700 }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={activeCourse}
        open={Boolean(activeCourse)}
        onClose={() => setActiveCourse(null)}
        isEnrolled={Boolean(
          activeCourse && enrolledCourseIds.has(activeCourse._id)
        )}
        onEnrollSuccess={(course) => {
          setEnrolledCourseIds((prev) => new Set([...prev, course._id]));
          setEnrolledNotice(
            `🎉 You have successfully enrolled in "${course.title}"!`
          );
        }}
      />

      {/* Enrollment Notice Toast */}
      <Snackbar
        open={Boolean(enrolledNotice)}
        autoHideDuration={4000}
        onClose={() => setEnrolledNotice(null)}
      >
        <Alert severity="success" sx={{ width: "100%", borderRadius: 2 }}>
          {enrolledNotice}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
