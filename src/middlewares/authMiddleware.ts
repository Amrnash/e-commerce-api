import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors.js";

interface DecodedToken extends JwtPayload {
  userId: string;
  roles: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    next(new UnauthorizedError("Invalid token"));
  }

  try {
    const token = authHeader?.split(" ")[1] || "";
    const secretKey = process.env.SECRET_KEY as string;
    const decodedToken = jwt.verify(token, secretKey) as DecodedToken;
    req.user = decodedToken;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid token"));
  }
};

export { authMiddleware };
