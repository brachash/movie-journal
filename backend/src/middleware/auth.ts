import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Request interface to include userId
interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Middleware to authenticate requests using JWT
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 * @returns Void or error response if authentication fails
 */
const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token', error: (error as Error).message });
  }
};

export default authenticate;