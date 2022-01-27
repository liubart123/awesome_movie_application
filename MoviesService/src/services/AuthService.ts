import jwt from 'jsonwebtoken';
import config from '../utils/config';

const AuthService = {
  verifyToken: (token: string) => {
    const payload = jwt.verify(token, config.JWT_SECRET);
    if (typeof payload === 'string') {
      throw new Error('invalid token`s payload');
    }
    return payload;
  },
};

export default AuthService;
