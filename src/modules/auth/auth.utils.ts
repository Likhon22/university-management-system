import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    userId: string;
    role: string;
  },
  secret: string,
  expireDate: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn: expireDate,
  });
};
