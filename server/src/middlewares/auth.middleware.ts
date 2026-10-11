import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../api/models/user.model";
import { IAuthUser } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "e_learn_super_secret_key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "e_learn_super_refresh_secret_key";

/**
 * Generates an access JWT token for a user
 */
export const generateAccessToken = (
  payload: IAuthUser,
  expiresIn: string = "15m"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const generateToken = generateAccessToken;

/**
 * Generates a refresh JWT token for a user
 */
export const generateRefreshToken = (
  payload: IAuthUser,
  expiresIn: string = "7d"
): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn } as jwt.SignOptions);
};

/**
 * Verifies an access token
 */
export const verifyAccessToken = (token: string): IAuthUser => {
  return jwt.verify(token, JWT_SECRET) as IAuthUser;
};

export const verifyToken = verifyAccessToken;

/**
 * Verifies a refresh token
 */
export const verifyRefreshToken = (token: string): IAuthUser => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as IAuthUser;
};

export const REFRESH_COOKIE_NAME = "refreshToken";

export const getRefreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
});

export const getClearRefreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
});

/**
 * Middleware to authenticate requests using token
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.headers["x-access-token"]) {
      token = String(req.headers["x-access-token"]);
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as IAuthUser;
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        };
        return next();
      } catch (err: any) {
        res.status(401).json({
          error: true,
          statusCode: 401,
          message: "Unauthorized: Invalid or expired authentication token",
        });
        return;
      }
    }

    res.status(401).json({
      error: true,
      statusCode: 401,
      message:
        "Unauthorized: Authentication token required (e.g. Bearer <token>)",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to enforce Role-Based Access Control (RBAC)
 */
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: true,
        statusCode: 401,
        message: "Unauthorized: User not authenticated",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: true,
        statusCode: 403,
        message: `Forbidden: Access denied. Role '${req.user.role}' is not authorized`,
      });
      return;
    }

    next();
  };
};
