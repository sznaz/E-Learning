import { Router, Request, Response, NextFunction } from "express";
import EnrollmentService from "../service/enrollment.service";
import { validate } from "../../middlewares/validate.middleware";
import {
  authenticate,
  authorizeRoles,
} from "../../middlewares/auth.middleware";
import {
  createEnrollmentSchema,
  updateEnrollmentSchema,
} from "../../validators/enrollment.validator";

const router = Router();
const enrollmentService = new EnrollmentService();

// GET all enrollments - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.get(
  "/",
  authenticate,
  authorizeRoles("STUDENT", "TEACHER", "SUPER_ADMIN"),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await enrollmentService.getEnrollments();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET all enrollments alias (/all) - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.get(
  "/all",
  authenticate,
  authorizeRoles("STUDENT", "TEACHER", "SUPER_ADMIN"),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await enrollmentService.getEnrollments();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET enrollment by ID - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.get(
  "/:id",
  authenticate,
  authorizeRoles("STUDENT", "TEACHER", "SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await enrollmentService.getEnrollmentById(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST create enrollment - Accessible by STUDENT and SUPER_ADMIN
router.post(
  "/",
  authenticate,
  authorizeRoles("STUDENT", "SUPER_ADMIN"),
  validate(createEnrollmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await enrollmentService.createEnrollment(req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update enrollment - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.put(
  "/:id",
  authenticate,
  authorizeRoles("STUDENT", "TEACHER", "SUPER_ADMIN"),
  validate(updateEnrollmentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await enrollmentService.updateEnrollment(id, req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE enrollment - Accessible only by SUPER_ADMIN
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await enrollmentService.deleteEnrollment(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
