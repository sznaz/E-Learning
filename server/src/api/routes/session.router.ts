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
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await sessionService.getSessions();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET all sessions alias (/all) - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.get(
  "/all",
  authenticate,
  authorizeRoles("STUDENT", "TEACHER", "SUPER_ADMIN"),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await sessionService.getSessions();
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
