import { User_Role } from '../../modules/user/user.constants';
import UserModel from '../../modules/user/user.model';
import config from '../config';

const superAdmin = {
  id: '0001',
  password: config.super_admin_password,

  needPasswordChange: false,
  email: config.super_admin_email,
  role: User_Role.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};
export const seedSuperAdmin = async () => {
  const isSuperAdminExists = await UserModel.findOne({
    role: User_Role.superAdmin,
  });
  if (!isSuperAdminExists) {
    await UserModel.create(superAdmin);
  }
};
