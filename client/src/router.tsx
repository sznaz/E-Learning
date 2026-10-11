import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Student & Public Pages
import HomePage from "./modules/student/pages/HomePage/HomePage";
import LoginPage from "./modules/auth/LoginPage";
import CoursesPage from "./modules/courses/CoursesPage";
import MyCoursesPage from "./modules/student/pages/MyCourses/MyCoursesPage";
import MySessionsPage from "./modules/student/pages/MySessions/MySessionsPage";

// Admin Pages
import AdminLayout from "./modules/admin/AdminLayout";
import AdminDashboard from "./modules/admin/AdminDashboard";
import AdminCourses from "./modules/admin/AdminCourses";
import AdminUsers from "./modules/admin/AdminUsers";
import AdminStudents from "./modules/admin/AdminStudents";
import AdminTeachers from "./modules/admin/AdminTeachers";

// Teacher Pages
import TeacherLayout from "./modules/teacher/TeacherLayout";
import TeacherDashboard from "./modules/teacher/TeacherDashboard";
import TeacherStudents from "./modules/teacher/TeacherStudents";
import TeacherSessions from "./modules/teacher/TeacherSessions";
import TeacherCourses from "./modules/teacher/TeacherCourses";

// Public Layout with Header
const PublicLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export const AppRouter: React.FC = () => {
  return (
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
  );
};

export default AppRouter;
