import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthService } from './guards.service';

// middleware Checks the Token
export const authenticate: RequestHandler = (req, res, next): void => {
  const token = AuthService.extractToken(req);
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const payload = AuthService.verifyToken(token);
  if (!payload) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  (req as any).user = payload;
  next();
};


// middleware Checks the Role
export function authorize(roles: string[]): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Access denied' });
      return; 
    }

    next();
  };
}