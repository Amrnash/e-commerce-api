import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./authMiddleware.js";
import { ForbiddenError } from "../utils/errors.js";

export function requireRoles(requiredRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const hasRequiredRole = requiredRoles.some((role) =>
      req.user?.roles.includes(role)
    );
    if (!hasRequiredRole) throw new ForbiddenError();
    next();
  };
}
