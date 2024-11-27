import config from '../../app/config';
import AppError from '../../app/error/AppError';
import bcrypt from 'bcrypt';
import UserModel from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
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

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });

  return {
    accessToken,
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

const authServices = {
  loginUser,
  changePassword,
};

export default authServices;
