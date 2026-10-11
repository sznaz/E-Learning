import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { coursesApi, Course } from "../../api/courses";

export const TeacherCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (err) {
      console.error("Failed to load courses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);
      const defaultThumbnail =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }} color="text.primary">
            Course Curriculum Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore academic courses and schedule associated live classroom sessions.
          </Typography>
        </Box>

      </Box>

      {loading ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {courses.map((c) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={c._id}>
              <Card
                sx={{
                  borderRadius: 3.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                }}
              >
                  <Box
                    component="img"
                    src={c.thumbnail || defaultThumbnail}
                    alt={c.title}
                    sx={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                <Box sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <Chip label={c.level} size="small" variant="outlined" sx={{ fontSize: "0.72rem" }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>
                    {c.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {c.description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default TeacherCourses;
