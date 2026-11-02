import dotenv from 'dotenv';
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'honda_tuning_default_secret_key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
