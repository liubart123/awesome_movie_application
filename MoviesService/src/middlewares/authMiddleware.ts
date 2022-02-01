import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import HttpException from '../types/HttpException';
import HttpStatuses from '../constants/HttpStatuses';

const authMiddleware = {
  requireUserRole: (...role: ('basic' | 'premium')[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        try {
          const token = authHeader.split(' ')[1];
          const user = AuthService.verifyToken(token);
          if (!role.includes(user.role)) {
            next(
              new HttpException(
                HttpStatuses.FORBIDDEN,
                'access is denied for this role',
              ),
            );
            return;
          }
          const { userId, name, role: userRole } = user;
          req.user = { userId, name, role: userRole };
          next();
        } catch (e: any) {
          next(
            new HttpException(
              HttpStatuses.UNAUTHORIZED,
              e.message ?? 'invalid token',
            ),
          );
        }
      } else {
        next(
          new HttpException(
            HttpStatuses.UNAUTHORIZED,
            'Header Authorization must contain jwt',
          ),
        );
      }
    };
  },
};

export default authMiddleware;
