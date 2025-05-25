import jwt from 'jsonwebtoken';
import { UnAuthenticatedError } from '../errors/index.js';

const authenticateUser = async (req, res, next) => {
  // Check if user is authenticated through session
  if (req.isAuthenticated() && req.user) {
    return next();
  }

  // Check if user has a valid session
  if (req.session && req.session.user) {
    req.user = req.session.user;
    return next();
  }

  // Check JWT token in cookie
  const token = req.cookies.token;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { userId: payload.userId };
      return next();
    } catch (error) {
      console.error('JWT verification failed:', error);
    }
  }

  return res.status(401).json({ error: 'Authentication Invalid' });
};

export default authenticateUser;
