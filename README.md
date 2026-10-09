# E-Learning Platform

A full-stack E-Learning Platform MVP with role-based access for Students, Teachers, and Super Admins.

Built with:

- React + TypeScript + Vite
- Material UI
- TanStack Query
- Zustand
- Axios
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Role-Based Access Control (RBAC)

---

# Project Structure

```bash
e-learning-platform/
│
├── client/
├── server/
└── README.md
```

---

# Prerequisites

Make sure you have installed:

- Node.js (v18+ recommended)
- npm
- MongoDB (Local or MongoDB Atlas)

---

# Backend Setup

## Navigate to server

```bash
cd server
```

## Install dependencies

```bash
npm install
```

## Create .env file

Create a `.env` file inside the `server` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Example:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/e-learning
JWT_SECRET=your-super-secret-key
CLIENT_URL=http://localhost:5173
```

## Start Backend

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## Navigate to client

```bash
cd client
```

## Install dependencies

```bash
npm install
```

## Create .env file

Create a `.env` file inside the `client` folder.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# Authentication

The application uses JWT-based authentication with HTTP-only cookies.

Supported roles:

- `STUDENT`
- `TEACHER`
- `SUPER_ADMIN`

Authentication flow:

```text
Login
  ↓
Validate Credentials
  ↓
Generate JWT
  ↓
HTTP-only Cookie
  ↓
Protected API
  ↓
Role Authorization
```

---

# Role-Based Access Control

## Student

- Register/Login
- Browse courses
- View course details
- Mock enrollment/payment
- View enrolled courses
- View dashboard

## Teacher

- Login
- View assigned students
- View student details
- Create/manage sessions
- View sessions

## Super Admin

- Manage users
- Manage courses
- View users
- Create/update/delete courses
- Create/update/delete users

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register student |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

## Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

## Enrollments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/enrollments` | Enroll in a course |
| GET | `/api/enrollments/my-courses` | Get student's courses |

## Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get users |
| GET | `/api/users/:id` | Get user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

## Sessions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sessions` | Get sessions |
| POST | `/api/sessions` | Create session |
| PUT | `/api/sessions/:id` | Update session |
| DELETE | `/api/sessions/:id` | Delete session |

---

# Features

### Student

- Student registration and login
- Course browsing
- Course details
- Mock payment/enrollment
- Student dashboard
- Enrolled courses
- Responsive UI

### Teacher

- Teacher dashboard
- Student list
- Student details
- Session management
- Basic student/session management

### Super Admin

- Admin dashboard
- User management
- Course management
- Role-based access control

### General

- JWT authentication
- HTTP-only cookies
- RBAC
- API validation
- Responsive UI
- Error handling
- MongoDB database integration
- Protected routes

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Material UI
- TanStack Query
- Zustand
- Axios
- React Router
- React Hook Form
- Zod

## Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod
- Helmet
- CORS

---

# State Management

### TanStack Query

Used for server state management including:

- Courses
- Students
- Sessions
- Enrollments
- User data

### Zustand

Used for lightweight client-side state such as:

- UI state
- Sidebar state
- User preferences
- Other global client state

---

# Running Both Applications

Open two terminals.

### Terminal 1 – Backend

```bash
cd server
npm install
npm run dev
```

### Terminal 2 – Frontend

```bash
cd client
npm install
npm run dev
```

Visit:

```bash
http://localhost:5173
```

---

# Initial Setup

After starting the application, a Super Admin user should be created to manage the platform.

The Super Admin can:

1. Create courses
2. Manage users
3. View registered students
4. Manage teachers

Students can then:

1. Register
2. Browse available courses
3. View course details
4. Complete mock payment
5. Get enrolled
6. Access the Student Dashboard

---

# Mock Payment Flow

The MVP uses a mock payment flow instead of a real payment gateway.

```text
Course Details
      ↓
Buy Course
      ↓
Mock Payment
      ↓
Payment Success
      ↓
Create Enrollment
      ↓
Student Dashboard
```

This can be replaced with Razorpay or another payment gateway in a production version.

---

# Demo Credentials

## Super Admin

```text
Email: admin@example.com
Password: ********
```

## Teacher

```text
Email: teacher@example.com
Password: ********
```

## Student

```text
Email: student@example.com
Password: ********
```

---

# Deployment

The application can be deployed using:

### Frontend

- Vercel

### Backend

- Render / AWS

### Database

- MongoDB Atlas

Environment variables should be configured separately for development and production environments.

---

# License

This project is developed as an MVP demonstration for the E-Learning Platform.