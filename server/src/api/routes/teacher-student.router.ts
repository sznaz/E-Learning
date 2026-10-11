import { Router, Request, Response, NextFunction } from "express";
import TeacherStudentService from "../service/teacher-student.service";
import { validate } from "../../middlewares/validate.middleware";
import {
  authenticate,
  authorizeRoles,
} from "../../middlewares/auth.middleware";
import { createTeacherStudentSchema } from "../../validators/teacher-student.validator";

const router = Router();
const teacherStudentService = new TeacherStudentService();

// GET all assignments - Accessible by TEACHER and SUPER_ADMIN
router.get(
  "/",
  authenticate,
  authorizeRoles("TEACHER", "SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter: any = { ...req.query };
      // If user is a TEACHER, scope by default unless admin
      if (req.user?.role === "TEACHER" && !filter.teacher) {
        filter.teacher = req.user.id;
      }
      const response = await teacherStudentService.getTeacherStudents(filter);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET assignment by ID - Accessible by TEACHER and SUPER_ADMIN
router.get(
  "/:id",
  authenticate,
  authorizeRoles("TEACHER", "SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await teacherStudentService.getTeacherStudentById(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST create assignment - Accessible by SUPER_ADMIN
router.post(
  "/",
  authenticate,
  authorizeRoles("SUPER_ADMIN"),
  validate(createTeacherStudentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await teacherStudentService.createTeacherStudent(req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE assignment - Accessible by SUPER_ADMIN
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await teacherStudentService.deleteTeacherStudent(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
