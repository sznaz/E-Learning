import { Router, Request, Response, NextFunction } from "express";
import UserService from "../service/user.service";
import { validate } from "../../middlewares/validate.middleware";
import {
  authenticate,
  authorizeRoles,
} from "../../middlewares/auth.middleware";
import {
  createUserSchema,
  updateUserSchema,
} from "../../validators/user.validator";

const router = Router();
const userService = new UserService();

// GET all users - Accessible by SUPER_ADMIN and TEACHER
router.get(
  "/",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "TEACHER"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await userService.getUsers(req.query);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET all users alias (/all) - Accessible by SUPER_ADMIN and TEACHER
router.get(
  "/all",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "TEACHER"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await userService.getUsers(req.query);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// GET user by ID - Accessible by STUDENT, TEACHER, SUPER_ADMIN
router.get(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "TEACHER", "STUDENT"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await userService.getUserById(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// POST create user - Accessible only by SUPER_ADMIN
router.post(
  "/",
  authenticate,
  authorizeRoles("SUPER_ADMIN"),
  validate(createUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await userService.createUser(req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// PUT update user - Accessible by user themselves or SUPER_ADMIN
router.put(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN", "TEACHER", "STUDENT"),
  validate(updateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await userService.updateUser(id, req.body);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

// DELETE user - Accessible only by SUPER_ADMIN
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("SUPER_ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const response = await userService.deleteUser(id);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
