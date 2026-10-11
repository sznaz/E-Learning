import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Bolt,
  CheckCircle,
  Close,
  Translate,
  SignalCellularAlt,
  BookmarkAdded,
  ArrowForward,
  Timer,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Course } from "../api/courses";
import { enrollmentsApi } from "../api/enrollments";
import { useAuth } from "../context/AuthContext";

interface CourseDetailModalProps {
  course: Course | null;
  open: boolean;
  onClose: () => void;
  isEnrolled?: boolean;
  onEnrollSuccess?: (enrolledCourse: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  open,
  onClose,
  isEnrolled = false,
  onEnrollSuccess,
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!course) return null;

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await enrollmentsApi.create({
        course: course._id,
        student: user?._id,
      });

      setSuccess(true);
      if (onEnrollSuccess) {
        onEnrollSuccess(course);
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message ||
        "Failed to enroll in this course. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    onClose();
  };

  const defaultThumbnail =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 2.5, sm: 3.5 },
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        },
      }}
    >
      {/* Hero Header */}
      <Box
        sx={{
          height: { xs: 200, sm: 260 },
          position: "relative",
          backgroundImage: `url(${course.thumbnail || defaultThumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 60%, rgba(15, 23, 42, 0.2) 100%)",
            p: { xs: 2.5, sm: 3.5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            color: "#ffffff",
          }}
        >
          {/* Top row badges and close button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip
                label={course.category || "General"}
                size="small"
                sx={{
                  bgcolor: "#4f46e5",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                }}
              />
              <Chip
                label={course.level}
                size="small"
                variant="outlined"
                sx={{
                  color: "#ffffff",
                  borderColor: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              />
            </Box>

            <IconButton
              onClick={handleClose}
              sx={{
                color: "#ffffff",
                bgcolor: "rgba(0, 0, 0, 0.4)",
                "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
              }}
              size="small"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Bottom Title */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.35rem", sm: "1.85rem" },
                lineHeight: 1.25,
                mb: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {course.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Translate sx={{ fontSize: 18, color: "#cbd5e1" }} />
                <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                  {course.language || "English"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <SignalCellularAlt sx={{ fontSize: 18, color: "#cbd5e1" }} />
                <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                  {course.level} Level
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Timer sx={{ fontSize: 18, color: "#cbd5e1" }} />
                <Typography variant="caption" sx={{ color: "#cbd5e1", fontWeight: 600 }}>
                  Self-paced + Live sessions
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 3, borderRadius: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  handleClose();
                  navigate("/my-courses");
                }}
              >
                Go to My Courses
              </Button>
            }
          >
            🎉 Enrollment confirmed! You are now enrolled in this masterclass.
          </Alert>
        )}

        {/* Pricing & Key Metrics Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "#f8fafc",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Tuition / Price
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, color: "#4f46e5", letterSpacing: "-0.02em" }}
            >
              ${course.price?.toFixed(2)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Curriculum Access
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              Lifetime + Mentor Q&A
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Certification
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              Verified Certificate Included
            </Typography>
          </Box>

          {isEnrolled && (
            <Chip
              icon={<BookmarkAdded />}
              label="Currently Enrolled"
              color="success"
              sx={{ fontWeight: 700, px: 1 }}
            />
          )}
        </Box>

        {/* Course Description */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, mb: 1.2, color: "#0f172a", fontSize: "1.1rem" }}
          >
            Course Overview
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.75, fontSize: "0.95rem" }}
          >
            {course.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* What You Will Learn */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, mb: 2, color: "#0f172a", fontSize: "1.1rem" }}
          >
            What You'll Gain in this Masterclass
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                title: "Industry Standard Practices",
                desc: "Gain fluency in tools and workflows used by top engineering teams globally.",
              },
              {
                title: "Live Interactive Sessions",
                desc: "Attend instructor-led sessions, ask direct questions, and solve challenges together.",
              },
              {
                title: "Portfolio Capstone Project",
                desc: "Complete comprehensive hands-on assignments to showcase on your CV.",
              },
              {
                title: "Accredited Certificate",
                desc: "Earn a shareable certificate of completion upon finishing all coursework.",
              },
            ].map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: "rgba(79, 70, 229, 0.04)",
                    border: "1px solid rgba(79, 70, 229, 0.08)",
                  }}
                >
                  <CheckCircle sx={{ color: "#10b981", fontSize: 20, mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      {/* Footer / Actions */}
      <DialogActions
        sx={{
          p: { xs: 2.5, sm: 3 },
          bgcolor: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 600 }}>
          Close
        </Button>

        <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : <Bolt />
              }
              disabled={loading}
              onClick={handleEnroll}
              sx={{
                px: 4,
                py: 1.3,
                borderRadius: 2.5,
                fontWeight: 700,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: "0 4px 15px rgba(79, 70, 229, 0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                },
              }}
            >
              {loading
                ? "Processing Enrollment..."
                : isAuthenticated
                ? `Enroll In Course (${course.price ? `$${course.price.toFixed(2)}` : "Free"})`
                : "Sign In to Enroll"}
            </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDetailModal;
