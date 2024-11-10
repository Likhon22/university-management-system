import mongoose from 'mongoose';
import config from '../../app/config';

import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import StudentModel from '../student/student.model';
import { TUser } from './user.interface';
import UserModel from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../app/error/AppError';

const saveStudentsIntoDB = async (password: string, studentData: TStudent) => {
  //   if (await StudentModel.isUserExists(studentData.id)) {
  //     throw new Error('Student already exists with the provided id');
  //   }
  const user: Partial<TUser> = {};
  user.password = password || (config.default_password as string);

  //   set user roles
  user.role = 'student';

  // find academic semester
  const admissionSemester = await academicSemesterModel.findById(
    studentData.admissionSemester,
  );

  if (!admissionSemester) {
    throw new Error('Admission semester not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    user.id = await generateStudentId(admissionSemester);

    const newUser = await UserModel.create([user], { session });

    //   create a student
    if (!newUser.length) {
      throw new AppError(500, 'User creation failed');
    }

    studentData.id = newUser[0].id;

    studentData.user = newUser[0]._id;

    const newStudent = await StudentModel.create([studentData], { session });
    if (!newStudent.length) {
      throw new AppError(500, 'Student creation failed');
    }
    await session.commitTransaction();
    await session.endSession();
    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const userServices = {
  saveStudentsIntoDB,
};
