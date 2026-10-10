import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import {
  MenuBook,
  PeopleAlt,
  School,
  WorkspacePremium,
  ArrowForward,
  Add,
  TrendingUp,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { coursesApi, Course } from "../../api/courses";
import { usersApi } from "../../api/users";
import { User } from "../../api/auth";

export const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesData, usersData] = await Promise.all([
          coursesApi.getAll(),
          usersApi.getAll(),
        ]);
        setCourses(coursesData);
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const studentsCount = users.filter((u) => u.role === "STUDENT").length;
  const teachersCount = users.filter((u) => u.role === "TEACHER").length;

  const statCards = [
    {
      title: "Total Courses",
      value: courses.length,
      icon: <MenuBook sx={{ fontSize: 28 }} />,
      color: "#4f46e5",
      bgColor: "rgba(79, 70, 229, 0.1)",
      path: "/admin/courses",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: <PeopleAlt sx={{ fontSize: 28 }} />,
      color: "#0284c7",
      bgColor: "rgba(2, 132, 199, 0.1)",
      path: "/admin/users",
    },
    {
      title: "Active Students",
      value: studentsCount,
      icon: <School sx={{ fontSize: 28 }} />,
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, 0.1)",
      path: "/admin/students",
    },
    {
      title: "Faculty Teachers",
      value: teachersCount,
      icon: <WorkspacePremium sx={{ fontSize: 28 }} />,
      color: "#7c3aed",
      bgColor: "rgba(124, 58, 237, 0.1)",
      path: "/admin/teachers",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Banner */}
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
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, fontSize: { xs: "1.45rem", sm: "1.85rem", md: "2.125rem" } }}
            color="text.primary"
          >
            Platform Overview
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
            Manage your educational courses, teachers, and enrolled students in one place.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, width: { xs: "100%", sm: "auto" }, flexDirection: { xs: "column", sm: "row" } }}>
          <Button
            component={RouterLink}
            to="/admin/courses"
            variant="contained"
            startIcon={<Add />}
            fullWidth
            sx={{ whiteSpace: "nowrap" }}
          >
            Manage Courses
          </Button>
          <Button
            component={RouterLink}
            to="/admin/users"
            variant="outlined"
            startIcon={<Add />}
            fullWidth
            sx={{ whiteSpace: "nowrap" }}
          >
            Manage Users
          </Button>
        </Box>
      </Box>

      {/* KPI Stat Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2.5, md: 3 }} sx={{ mb: 4 }}>
        {statCards.map((stat, idx) => (
          <Grid key={idx} size={{ xs: 6, sm: 6, lg: 3 }}>
            <Card
              sx={{
                p: { xs: 1.5, sm: 2.5 },
                position: "relative",
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: { xs: 1, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 40, sm: 52 },
                    height: { xs: 40, sm: 52 },
                    borderRadius: { xs: 2, sm: 3 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: stat.bgColor,
                    color: stat.color,
                    "& svg": {
                      fontSize: { xs: 22, sm: 28 },
                    },
                  }}
                >
                  {stat.icon}
                </Box>
                <IconButton
                  component={RouterLink}
                  to={stat.path}
                  size="small"
                  sx={{ color: "text.secondary", p: { xs: 0.5, sm: 1 } }}
                >
                  <ArrowForward sx={{ fontSize: { xs: 16, sm: 20 } }} />
                </IconButton>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
                  color="text.primary"
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {stat.title}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
