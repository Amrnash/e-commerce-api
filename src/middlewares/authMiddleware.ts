import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors";

interface DecodedToken extends JwtPayload {
  userId: string;
  roles: string[];
}

interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new UnauthorizedError("Invalid token");
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.SECRET_KEY as string;
  try {
    const decodedToken = jwt.verify(token, secretKey) as DecodedToken;
    req.user = decodedToken;
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

export { authMiddleware };
