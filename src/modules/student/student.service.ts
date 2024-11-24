import mongoose from 'mongoose';
import StudentModel from './student.model';
import AppError from '../../app/error/AppError';
import UserModel from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { studentSearchableField } from './student.constants';

const getStudentsFromDB = async (query: Record<string, unknown>) => {
  const searchQuery = new QueryBuilder(
    StudentModel.find()

      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await searchQuery.modelQuery;
  return result;

  // const search = StudentModel.find({
  //   $or: studentSearchableField.map(field => ({
  //     [field]: {
  //       $regex: searchTerm,
  //       $options: 'i',
  //     },
  //   })),
  // });
  // const queryObj = {
  //   ...query,
  // };
  // const excludeFields = ['searchTerm', 'sort', 'page', 'limit', 'fields'];
  // excludeFields.forEach(el => delete queryObj[el]);
  // console.log({ query }, { queryObj });

  // const filter = search.find(queryObj);
  // const sort = query?.sort || '-createdAt';
  // const sortQuery = filter.sort(sort as string);
  // const page = Number(query?.page) || 1;
  // const limit = Number(query?.limit) || 10;
  // const skip = (page - 1) * limit;
  // const paginateQuery = sortQuery.skip(skip).limit(limit);
  // const fields = query?.fields
  //   ? (query.fields as string).split(',').join(' ')
  //   : '';
  // const fieldsQuery = await paginateQuery.select(fields);
  // return fieldsQuery;
  // const studentQuery = new QueryBuilder(StudentModel.find(), query)
  //   .search(studentSearchableField)
  //   .filter()
  //   .sort()
  //   .paginate()
  //   .fields();
  // const result = await studentQuery.modelQuery
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // return result;
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
