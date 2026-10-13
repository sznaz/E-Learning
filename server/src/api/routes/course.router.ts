import { Router, Request, Response, NextFunction } from "express";
import CourseService from "../service/course.service";
import { validate } from "../../middlewares/validate.middleware";
import {
  authenticate,
  authorizeRoles,
} from "../../middlewares/auth.middleware";
import {
  createCourseSchema,
  updateCourseSchema,
} from "../../validators/course.validator";

const router = Router();
const courseService = new CourseService();

// GET all courses - Accessible by all users
router.get(
  "/",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await courseService.getCourses();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);


// GET course by ID - Accessible by all users
router.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await courseService.getCourseById(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST create course - Accessible by TEACHER and SUPER_ADMIN
router.post(
  "/",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "TEACHER"),
  validate(createCourseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await courseService.createCourse(req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update course - Accessible by TEACHER and SUPER_ADMIN
router.put(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "TEACHER"),
  validate(updateCourseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await courseService.updateCourse(id, req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE course - Accessible only by SUPER_ADMIN
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await courseService.deleteCourse(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
