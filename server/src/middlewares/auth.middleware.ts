import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../api/models/user.model";
import { IAuthUser } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "e_learn_super_secret_key";

/**
 * Generates a signed JWT token for a user
 */
export const generateToken = (
  payload: IAuthUser,
  expiresIn: string = "7d"
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

/**
 * Middleware to authenticate requests using JWT Bearer token
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
        message: `Forbidden: Access denied. Role '${req.user.role}' is not authorized.}`,
      });
      return;
    }

    next();
  };
};
