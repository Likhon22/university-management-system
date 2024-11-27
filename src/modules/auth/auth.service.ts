import config from '../../app/config';
import AppError from '../../app/error/AppError';
import bcrypt from 'bcrypt';
import UserModel from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  //   checking if the user is exists
  const isUserExists = await UserModel.isUserExistsByCustomId(payload.id);

  if (!isUserExists) {
    throw new AppError(404, 'User not found');
  }
  // checking if the user is already deleted

  if (UserModel.isUserDeletedByCustomId(isUserExists)) {
    throw new AppError(404, 'User not found--delete');
  }
  // checking if the user is blocked

  if (UserModel.isUserBlockedByCustomId(isUserExists)) {
    throw new AppError(403, 'User is blocked');
  }
  //   checking if the password is correct

  const isPasswordCorrect = await UserModel.isPasswordCorrect(
    payload.password,
    isUserExists.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError(403, 'Invalid password');
  }
  //   create a token and send to the client

  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_duration as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_duration as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExists.needPasswordChange,
  };
  //   access granted
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const { userId, role } = userData;
  const user = await UserModel.isUserExistsByCustomId(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const isPasswordCorrect = await UserModel.isPasswordCorrect(
    payload.oldPassword,
    user?.password,
  );
  if (UserModel.isUserDeletedByCustomId(user)) {
    throw new AppError(404, 'User not found--delete');
  }
  // checking if the user is blocked

  if (UserModel.isUserBlockedByCustomId(user)) {
    throw new AppError(403, 'User is blocked');
  }

  if (!isPasswordCorrect) {
    throw new AppError(403, 'Invalid old password');
  }
  //   hash new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );
  await UserModel.findOneAndUpdate(
    {
      id: userId,
      role,
    },
    {
      $set: {
        password: hashedPassword,
        needPasswordChange: false,
        passwordChangedAt: new Date(),
      },
    },
  );
  return null;
};

const refreshToken = async (token: string) => {
  // check if the token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  const { userId, iat } = decoded;

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
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_duration as string,
  );
  return {
    accessToken,
  };
};

const authServices = {
  loginUser,
  changePassword,
  refreshToken,
};

export default authServices;
