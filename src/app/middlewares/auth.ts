/* eslint-disable @typescript-eslint/no-unused-vars */
import { TUserRole } from '../../modules/user/user.interface';
import UserModel from '../../modules/user/user.model';
import config from '../config';
import AppError from '../error/AppError';
import catchAsync from '../utils/catchAsync';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(401, 'Unauthorized');
    }
    // check if the token is valid
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(401, 'Unauthorized');
    }

    const { userId, role, iat } = decoded;

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(401, 'Unauthorized');
    }
    const user = await UserModel.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    if (UserModel.isUserDeletedByCustomId(user)) {
      throw new AppError(404, 'User not found--delete');
    }
    // checking if the user is blocked

    if (UserModel.isUserBlockedByCustomId(user)) {
      throw new AppError(403, 'User is blocked');
    }

    if (
      user.passwordChangedAt &&
      UserModel.isJWTIssuedBeforePasswordChange(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(401, 'Unauthorized');
    }
    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
