import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../service/auth.service";
import { validate } from "../../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
} from "../../validators/auth.validator";
import {
  AUTH_COOKIE_NAME,
  getAuthCookieOptions,
  getClearAuthCookieOptions,
} from "../../middlewares/auth.middleware";

const router = Router();
const authService = new AuthService();

/**
 * POST /api/auth/register
 * Register a new user, set token cookie, and return user info with token
 */
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await authService.register(req.body);
      if (!response.error && response.data?.token) {
        res.cookie(
          AUTH_COOKIE_NAME,
          response.data.token,
          getAuthCookieOptions()
        );
      }
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user, set token cookie, and return user info with token
 */
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await authService.login(req.body);
      if (!response.error && response.data?.token) {
        res.cookie(
          AUTH_COOKIE_NAME,
          response.data.token,
          getAuthCookieOptions()
        );
      }
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/logout
 * Clear token cookie and logout user
 */
router.post(
  "/logout",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie(AUTH_COOKIE_NAME, getClearAuthCookieOptions());
      const response = await authService.logout();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
