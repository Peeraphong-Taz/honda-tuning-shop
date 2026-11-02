import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

/**
 * Generate a JWT token for a given user payload
 * @param {Object} user - User object containing _id and role
 * @returns {string} Signed JWT token
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role || 'user'
    },
    jwtConfig.secret,
    {
      expiresIn: jwtConfig.expiresIn
    }
  );
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};
