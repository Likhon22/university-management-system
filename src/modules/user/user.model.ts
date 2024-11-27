import { model, Schema } from 'mongoose';
import { TUser, User } from './user.interface';

import bcrypt from 'bcrypt';
import config from '../../app/config';

const userSchema = new Schema<TUser, User>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needPasswordChange: {
      type: Boolean,

      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'student', 'faculty'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round),
  );
  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await UserModel.findOne({ id }).select('+password');
};
userSchema.statics.isUserDeletedByCustomId = function (user: TUser) {
  const isDeleted = user?.isDeleted;
  return isDeleted;
};
userSchema.statics.isUserBlockedByCustomId = function (user: TUser) {
  const status = user?.status;
  if (status === 'blocked') {
    return true;
  }
  return false;
};

userSchema.statics.isPasswordCorrect = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  const checkPassword = await bcrypt.compare(plainTextPassword, hashedPassword);
  return checkPassword;
};
userSchema.statics.isJWTIssuedBeforePasswordChange = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;

  return passwordChangedTime > jwtIssuedTimestamp;
};

const UserModel = model<TUser, User>('User', userSchema);

export default UserModel;
