import jwt from 'jsonwebtoken';

export const getUser = token => {
  return jwt.decode(token);
}