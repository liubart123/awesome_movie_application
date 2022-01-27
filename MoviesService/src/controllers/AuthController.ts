import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import HttpException from '../types/HttpException';

const AuthController = {
  requireUserRole: (...role: ('basic' | 'premium')[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const user = AuthService.verifyToken(token);
          if (!role.includes(user.role)) {
            res.status(403).send('access is denied for this role');
          }
          const { userId, name, role: userRole } = user;
          req.user = { userId, name, role: userRole };
          next();
        } catch (e: any) {
          next(new HttpException(403, e.message ?? 'invalid token'));
        }
      } else {
        next(new HttpException(401, ''));
      }
    };
  },
};

export default AuthController;
