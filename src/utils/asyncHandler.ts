import { Request, Response, NextFunction } from "express";
type AsyncMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export function asyncHandler(middleware: AsyncMiddleware) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
