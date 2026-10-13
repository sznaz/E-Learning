import { Router, Request, Response, NextFunction } from "express";
import SessionService from "../service/session.service";
import { validate } from "../../middlewares/validate.middleware";
import {
  authenticate,
  authorizeRoles,
} from "../../middlewares/auth.middleware";
import {
  createSessionSchema,
  updateSessionSchema,
} from "../../validators/session.validator";

const router = Router();
const sessionService = new SessionService();

// GET all sessions - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.get(
  "/",
  authenticate,
  authorizeRoles("STUDENT", "TEACHER", "SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await sessionService.getSessions(req.query as any);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET sessions by instructor - Accessible by TEACHER, SUPER_ADMIN
router.get(
  "/instructor",
  authenticate,
  authorizeRoles("TEACHER", "SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id as string;
      const response = await sessionService.getSessions({ instructor: id });
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET sessions by my courses - Accessible by STUDENT
router.get(
  "/my-courses",
  authenticate,
  authorizeRoles("STUDENT"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id as string;
      const response = await sessionService.getSessionsByCourse(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET session by ID - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.get(
  "/:id",
  authenticate,
  authorizeRoles("STUDENT", "TEACHER", "SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await sessionService.getSessionById(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST create session - Accessible by TEACHER and SUPER_ADMIN
router.post(
  "/",
  authenticate,
  authorizeRoles("TEACHER", "SUPER_ADMIN"),
  validate(createSessionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body.instructor && req.user?.id) {
        req.body.instructor = req.user.id;
      }
      const response = await sessionService.createSession(req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update session - Accessible by TEACHER and SUPER_ADMIN
router.put(
  "/:id",
  authenticate,
  authorizeRoles("TEACHER", "SUPER_ADMIN"),
  validate(updateSessionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await sessionService.updateSession(id, req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE session - Accessible by TEACHER and SUPER_ADMIN
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("TEACHER", "SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await sessionService.deleteSession(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
