import mongoose from 'mongoose';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { facultySearchableField } from './faculty.constants';

import FacultyModel from './faculty.model';
import AppError from '../../app/error/AppError';
import UserModel from '../user/user.model';
import TFaculty from './faculty.interface';

const getFacultyFromDB = async (query: Record<string, unknown>) => {
  const faculty = new QueryBuilder(FacultyModel.find(), query)
    .search(facultySearchableField)
    .paginate()
    .sort()
    .filter()
    .paginate()
    .fields();
  const result = await faculty.modelQuery;
  return result;
};
const getSingleFacultyFromDB = async (id: string) => {
  const faculty = await FacultyModel.findById({ _id: id });

  return faculty;
};
const updateFacultyFromDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingData } = payload;
  const modifiedUpdatedFacultyData: Record<string, unknown> = {
    ...remainingData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedFacultyData[`name.${key}`] = value;
    }
  }
  const result = await FacultyModel.findByIdAndUpdate(
    { _id: id },
    modifiedUpdatedFacultyData,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};
const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedFaculty = await FacultyModel.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFaculty) {
      throw new AppError(400, 'Failed to delete faculty');
    }
    const user = deletedFaculty.user;
    await UserModel.findOneAndUpdate(
      { _id: user },
      { isDeleted: true },
      { new: true, session },
    );

    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err.message);
  }
};

const facultyServices = {
  getFacultyFromDB,
  getSingleFacultyFromDB,
  updateFacultyFromDB,
  deleteFacultyFromDB,
};

export default facultyServices;
