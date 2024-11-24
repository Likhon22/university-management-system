import QueryBuilder from '../../app/builder/QueryBuilder';
import { AdminModel } from './admin.model';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const admins = new QueryBuilder(AdminModel.find(), query).fields();
  const result = await admins.modelQuery;
  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const admin = await AdminModel.findById({ _id: id });
  return admin;
};

const deleteAdminFromDB = async (id: string) => {
  const result = await AdminModel.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

const adminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  deleteAdminFromDB,
};

export default adminServices;
