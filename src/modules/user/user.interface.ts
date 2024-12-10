import { User_Role } from './user.constants';
import { Model } from 'mongoose';

export interface TUser {
  id: string;
  password: string;
  passwordChangedAt?: Date;
  needPasswordChange: boolean;
  email: string;
  role: 'admin' | 'student' | 'faculty' | 'superAdmin';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface User extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser | null>;
  isUserDeletedByCustomId(user: TUser): boolean;
  isUserBlockedByCustomId(user: TUser): string;
  isJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;

  isPasswordCorrect(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof User_Role;
