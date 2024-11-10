import mongoose from 'mongoose';
import StudentModel from './student.model';
import AppError from '../../app/error/AppError';
import UserModel from '../user/user.model';
import { TStudent } from './student.interface';

const getStudentsFromDB = async () => {
  const students = await StudentModel.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return students;
};

const getSingleStudentFromDB = async (id: string) => {
  const student = await StudentModel.findOne({ _id: id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  return student;
};

const updateStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, localGuardian, guardian, ...remainingStudentData } = payload;

  const modifiedUpdatedStudentData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedStudentData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedStudentData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedStudentData[`localGuardian.${key}`] = value;
    }
  }

  const updatedStudent = await StudentModel.findOneAndUpdate(
    { id },
    modifiedUpdatedStudentData,
    {
      new: true,
    },
  );

  return updatedStudent;
};

const deleteStudentFromDB = async (id: string) => {
  const isExist = await StudentModel.isUserExists(id);

  if (!isExist) {
    throw new AppError(404, 'Student not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(400, 'Failed to delete student');
    }
    const deletedUser = await UserModel.findOneAndUpdate(
      { id },
      { $set: { isDeleted: true } },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(400, 'Failed to delete user');
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new Error('Failed to delete student');
  }
};

const studentServices = {
  getStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentFromDB,
};
export default studentServices;
