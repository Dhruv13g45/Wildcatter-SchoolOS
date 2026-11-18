import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'UNAUTHORIZED',
      message: 'Access token required. Please sign in.',
    });
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'FORBIDDEN',
        message: 'Invalid or expired authentication token.',
      });
    }
    req.user = user;
    next();
  });
};

export const requireRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: 'UNAUTHORIZED', message: 'Authentication required' });
  }

  const userRoles = req.user.active_roles || [];
  const hasRole = allowedRoles.some((role) => userRoles.includes(role));

  if (!hasRole && !userRoles.includes('Admin')) {
    return res.status(403).json({
      status: 'FORBIDDEN',
      message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
    });
  }

  next();
};

