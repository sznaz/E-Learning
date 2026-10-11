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
  TextField,
  InputAdornment,
  CircularProgress,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  Translate,
  MenuBook,
  Star,
  BookmarkAdded,
} from "@mui/icons-material";
import { coursesApi, Course } from "../../api/courses";
import { enrollmentsApi } from "../../api/enrollments";
import { useAuthStore } from "../../store/useAuthStore";
import CourseDetailModal from "../../components/CourseDetailModal";

export const CoursesPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Enrolled course IDs for currently logged in student
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(
    new Set()
  );

  // Detail Modal
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [enrolledNotice, setEnrolledNotice] = useState<string | null>(null);

  const fetchCoursesAndEnrollments = async () => {
    try {
      setLoading(true);
      const coursesData = await coursesApi.getAll();
      setCourses(coursesData);

      if (isAuthenticated) {
        try {
          const userEnrollments = await enrollmentsApi.getAll();
          const ids = new Set<string>();
          userEnrollments.forEach((e) => {
            const courseId =
              typeof e.course === "object" ? e.course._id : e.course;
            if (courseId) ids.add(courseId);
          });
          setEnrolledCourseIds(ids);
        } catch {
          // Ignore enrollment fetch error if not available
        }
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesAndEnrollments();
  }, [isAuthenticated]);


  const handleEnrollSuccess = (course: Course) => {
    setEnrolledCourseIds((prev) => new Set([...prev, course._id]));
    setEnrolledNotice(`🎉 You have successfully enrolled in "${course.title}"!`);
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8, bgcolor: "#f8fafc" }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4338ca 100%)",
          color: "#ffffff",
          py: { xs: 6, md: 8 },
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 760, mx: "auto", textAlign: "center" }}>
            <Chip
              label="DISCOVER OUR MASTERCLASSES"
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
              variant="h2"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.2rem", sm: "3.2rem" },
                mb: 2,
                letterSpacing: "-0.02em",
              }}
            >
              Explore World-Class Courses
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#c7d2fe",
                fontWeight: 400,
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.15rem" },
              }}
            >
              Learn from industry leaders. Build job-ready engineering, design, and AI skills with interactive, practical curricula.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Catalog Container */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Courses Cards Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading courses catalog...
            </Typography>
          </Box>
        ) : courses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <MenuBook sx={{ fontSize: 50, color: "text.secondary", mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No courses found
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {courses.map((c) => {
              const isEnrolled = enrolledCourseIds.has(c._id);

              return (
                <Grid key={c._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      borderRadius: 3.5,
                      boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                      overflow: "hidden",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={
                          c.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
                        }
                        alt={c.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <Chip
                        label={c.category || "General"}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          bgcolor: "rgba(15, 23, 42, 0.8)",
                          color: "#ffffff",
                          backdropFilter: "blur(4px)",
                          fontWeight: 600,
                        }}
                      />
                      {isEnrolled ? (
                        <Chip
                          icon={<BookmarkAdded sx={{ "&&": { color: "#ffffff" } }} />}
                          label="Enrolled"
                          size="small"
                          color="success"
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            fontWeight: 800,
                            fontSize: "0.82rem",
                          }}
                        />
                      ) : (
                        <Chip
                          label={`$${c.price?.toFixed(2)}`}
                          size="small"
                          color="primary"
                          sx={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            fontWeight: 800,
                            fontSize: "0.85rem",
                          }}
                        />
                      )}
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={c.level}
                          size="small"
                          color={
                            c.level === "Beginner"
                              ? "info"
                              : c.level === "Intermediate"
                              ? "primary"
                              : "secondary"
                          }
                          variant="outlined"
                          sx={{ fontSize: "0.7rem", height: 20 }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            ml: "auto",
                          }}
                        >
                          <Star sx={{ fontSize: 16, color: "#f59e0b" }} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            4.9 (1.2k)
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          lineHeight: 1.3,
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "2.6em",
                        }}
                      >
                        {c.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          minHeight: "4.2em",
                          mb: 2,
                        }}
                      >
                        {c.description}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mt: "auto",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                          }}
                        >
                          <Translate
                            fontSize="small"
                            sx={{ color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {c.language || "English"}
                          </Typography>
                        </Box>

                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => setActiveCourse(c)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 700,
                            textTransform: "none",
                            ...(isEnrolled && {
                              bgcolor: "#10b981",
                              "&:hover": { bgcolor: "#059669" },
                            }),
                          }}
                        >
                          {isEnrolled ? "View Details & Enrolled" : "Course Details"}
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
        course={activeCourse}
        open={Boolean(activeCourse)}
        onClose={() => setActiveCourse(null)}
        isEnrolled={Boolean(activeCourse && enrolledCourseIds.has(activeCourse._id))}
        onEnrollSuccess={handleEnrollSuccess}
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

export default CoursesPage;
