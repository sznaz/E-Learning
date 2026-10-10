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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Rating,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Search,
  School,
  Translate,
  SignalCellularAlt,
  CheckCircle,
  MenuBook,
  Bolt,
  Star,
} from "@mui/icons-material";
import { coursesApi, Course } from "../../api/courses";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "ALL",
  "Web Development",
  "Artificial Intelligence",
  "Programming",
  "Cloud & DevOps",
  "Design",
  "Cybersecurity",
];

export const CoursesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  // Detail Modal
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [enrolledNotice, setEnrolledNotice] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getAll();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "ALL" || c.category === selectedCategory;
      const matchLevel = selectedLevel === "ALL" || c.level === selectedLevel;
      return matchSearch && matchCategory && matchLevel;
    });
  }, [courses, search, selectedCategory, selectedLevel]);

  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setEnrolledNotice(true);
    setActiveCourse(null);
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 8 }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
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
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Explore World-Class Courses
            </Typography>
            <Typography variant="h6" sx={{ color: "#c7d2fe", fontWeight: 400, mb: 4 }}>
              Learn from industry leaders. Build job-ready engineering, design, and AI skills with interactive, practical curricula.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Catalog Container */}
      <Container maxWidth="lg" sx={{ mt: 5 }}>

        {/* Courses Cards Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading courses catalog...
            </Typography>
          </Box>
        ) : filteredCourses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <MenuBook sx={{ fontSize: 50, color: "text.secondary", mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your domain filters or search query.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {filteredCourses.map((c) => (
              <Grid key={c._id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
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
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <Translate fontSize="small" sx={{ color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {c.language || "English"}
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setActiveCourse(c)}
                        sx={{ borderRadius: 2 }}
                      >
                        Course Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Course Detail Modal */}
      {activeCourse && (
        <Dialog
          open={Boolean(activeCourse)}
          onClose={() => setActiveCourse(null)}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: {
              sx: { borderRadius: 3, overflow: "hidden" },
            },
          }}
        >
          <Box
            sx={{
              height: 220,
              position: "relative",
              backgroundImage: `url(${
                activeCourse.thumbnail ||
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 100%)",
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                color: "#ffffff",
              }}
            >
              <Chip
                label={activeCourse.category}
                size="small"
                sx={{ bgcolor: "#4f46e5", color: "#fff", width: "fit-content", mb: 1 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {activeCourse.title}
              </Typography>
            </Box>
          </Box>

          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Difficulty Level
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {activeCourse.level}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Audio & Subtitles
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {activeCourse.language || "English"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Tuition Fee
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.main" }}>
                  ${activeCourse.price?.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              About This Course
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
              {activeCourse.description}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, mt: 3 }}>
              What You Will Learn
            </Typography>
            <Grid container spacing={1.5}>
              {[
                "Production-ready architectures and best practices",
                "Real-world enterprise project portfolios",
                "Interactive coding sessions and assignments",
                "Accredited Certificate of Completion",
              ].map((item, idx) => (
                <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle sx={{ color: "#10b981", fontSize: 18 }} />
                    <Typography variant="body2">{item}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3, bgcolor: "#f8fafc" }}>
            <Button onClick={() => setActiveCourse(null)} color="inherit">
              Close
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Bolt />}
              onClick={handleEnroll}
              sx={{ px: 4 }}
            >
              Enroll In Course Now (${activeCourse.price?.toFixed(2)})
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Enrollment Notice Toast */}
      <Snackbar
        open={enrolledNotice}
        autoHideDuration={4000}
        onClose={() => setEnrolledNotice(false)}
      >
        <Alert severity="success" sx={{ width: "100%", borderRadius: 2 }}>
          🎉 Congratulations! You have successfully enrolled in this course.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CoursesPage;
