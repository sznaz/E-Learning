import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Student & Public Pages
const HomePage = lazy(() => import("./modules/student/pages/HomePage/HomePage"));
const LoginPage = lazy(() => import("./modules/auth/LoginPage"));
const CoursesPage = lazy(() => import("./modules/courses/CoursesPage"));
const MyCoursesPage = lazy(() => import("./modules/student/pages/MyCourses/MyCoursesPage"));
const MySessionsPage = lazy(() => import("./modules/student/pages/MySessions/MySessionsPage"));

// Admin Pages
const AdminLayout = lazy(() => import("./modules/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./modules/admin/AdminDashboard"));
const AdminCourses = lazy(() => import("./modules/admin/AdminCourses"));
const AdminUsers = lazy(() => import("./modules/admin/AdminUsers"));
const AdminStudents = lazy(() => import("./modules/admin/AdminStudents"));
const AdminTeachers = lazy(() => import("./modules/admin/AdminTeachers"));

// Teacher Pages
const TeacherLayout = lazy(() => import("./modules/teacher/TeacherLayout"));
const TeacherDashboard = lazy(() => import("./modules/teacher/TeacherDashboard"));
const TeacherStudents = lazy(() => import("./modules/teacher/TeacherStudents"));
const TeacherSessions = lazy(() => import("./modules/teacher/TeacherSessions"));
const TeacherCourses = lazy(() => import("./modules/teacher/TeacherCourses"));

// Loading fallback component
const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      width: "100%",
    }}
  >
    <CircularProgress sx={{ color: "#6366f1" }} />
  </Box>
);

// Public Layout with Header
const PublicLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes with Main Header */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/my-courses"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <MyCoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-sessions"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <MySessionsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Teacher Portal Routes (Protected) */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={["TEACHER", "SUPER_ADMIN"]}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="sessions" element={<TeacherSessions />} />
          <Route path="courses" element={<TeacherCourses />} />
        </Route>

        {/* Admin Management Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
