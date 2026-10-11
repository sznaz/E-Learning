import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../service/auth.service";
import { validate } from "../../middlewares/validate.middleware";
import {
  registerSchema,
  loginSchema,
} from "../../validators/auth.validator";
import {
  REFRESH_COOKIE_NAME,
  getRefreshCookieOptions,
  getClearRefreshCookieOptions,
} from "../../middlewares/auth.middleware";

const router = Router();
const authService = new AuthService();

/**
 * POST /api/auth/register
 * Register a new user, send refreshToken in cookie, return user info with accessToken
 */
router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await authService.register(req.body);
      if (!response.error && response.data?.refreshToken) {
        res.cookie(
          REFRESH_COOKIE_NAME,
          response.data.refreshToken,
          getRefreshCookieOptions()
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
 * Authenticate user, send refreshToken in cookie, return user info with accessToken
 */
router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await authService.login(req.body);
      if (!response.error && response.data?.refreshToken) {
        res.cookie(
          REFRESH_COOKIE_NAME,
          response.data.refreshToken,
          getRefreshCookieOptions()
        );
      }
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/refresh
 * Refresh access token using refreshToken cookie, update refreshToken cookie
 */
router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
      if (!refreshToken) {
        return res.status(401).json({
          error: true,
          statusCode: 401,
          message: "Refresh token not provided",
        });
      }

      const response = await authService.refresh(refreshToken);
      if (!response.error && response.data?.refreshToken) {
        res.cookie(
          REFRESH_COOKIE_NAME,
          response.data.refreshToken,
          getRefreshCookieOptions()
        );
      }
      return res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/logout
 * Clear refreshToken cookie and logout user
 */
router.post(
  "/logout",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie(REFRESH_COOKIE_NAME, getClearRefreshCookieOptions());
      const response = await authService.logout();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
