import jwt from 'jsonwebtoken';

export const getUser = authorizationHeader => {
  const token = authorizationHeader.split(' ')[1];
  return jwt.decode(token);
}