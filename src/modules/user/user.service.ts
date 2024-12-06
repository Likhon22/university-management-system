/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../app/config';

import { academicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import StudentModel from '../student/student.model';
import { TUser } from './user.interface';
import UserModel from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import AppError from '../../app/error/AppError';
import TFaculty from '../faculty/faculty.interface';
import FacultyModel from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { AdminModel } from '../admin/admin.model';

const createStudentsIntoDB = async (
  password: string,
  studentData: TStudent,
) => {
  //   if (await StudentModel.isUserExists(studentData.id)) {
  //     throw new Error('Student already exists with the provided id');
  //   }
  const user: Partial<TUser> = {};
  user.password = password || (config.default_password as string);

  //   set user roles
  user.role = 'student';
  user.email = studentData.email;

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
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, error.message);
  }
};

// faculty creation

const createFacultyIntoDB = async (password: string, facultyData: TFaculty) => {
  const user: Partial<TUser> = {};

  user.role = 'faculty';
  user.password = password || config.default_password;

  user.id = await generateFacultyId();
  user.email = facultyData.email;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const newUser = await UserModel.create([user], { session });

    if (!newUser.length) {
      throw new AppError(500, 'Faculty creation failed');
    }
    facultyData.id = newUser[0].id;
    facultyData.user = newUser[0]._id;

    const result = await FacultyModel.create([facultyData], { session });
    if (!result.length) {
      throw new AppError(500, 'Faculty creation failed');
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, err.message);
  }
};

// admin creation
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const user: Partial<TUser> = {};
  const session = await mongoose.startSession();
  try {
    user.id = await generateAdminId();
    user.password = password || config.default_password;
    user.role = 'admin';
    user.email = payload.email;
    session.startTransaction();
    const newUser = await UserModel.create([user], { session });
    if (!newUser.length) {
      throw new AppError(500, 'Admin creation failed');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    const result = await AdminModel.create([payload], { session });
    if (!result.length) {
      throw new AppError(500, 'Admin creation failed');
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(400, err.message);
  }
};

export const userServices = {
  createStudentsIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
