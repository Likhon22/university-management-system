import { semesterRegistrationModel } from './../semesterRegistration/semesterRegistration.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import AppError from '../../app/error/AppError';
import OfferedCourseModel from '../offeredCourse/offeredCourse.model';
import StudentModel from '../student/student.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourseModel from './enrolledCourse.model';
import { CourseModel } from '../course/course.model';
import FacultyModel from '../faculty/faculty.model';
import { calculateGradesAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../app/builder/QueryBuilder';

const createEnrolledCourseInDB = async (
  payload: TEnrolledCourse,
  userId: string,
) => {
  const student = await StudentModel.findOne({ id: userId });
  if (!student) {
    throw new AppError(404, 'Student not found');
  }
  const offeredCourse = await OfferedCourseModel.findById(
    payload.offeredCourse,
  );
  if (!offeredCourse) {
    throw new AppError(404, 'Offered course not found');
  }

  //   checking if the student is already enrolled in the course
  const isEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: offeredCourse.semesterRegistration,
    student: student._id,
    offeredCourse: offeredCourse,
  });
  if (isEnrolled) {
    throw new AppError(400, 'Student is already enrolled');
  }
  if (offeredCourse.maxCapacity === 0) {
    throw new AppError(400, 'Course is full');
  }
  payload.semesterRegistration = offeredCourse.semesterRegistration;

  const semesterRegistration = await semesterRegistrationModel.findById(
    offeredCourse.semesterRegistration,
    { maxCredit: 1, _id: 0 },
  );
  const course = await CourseModel.findById(offeredCourse.course, {
    credit: 1,
    _id: 0,
  });

  //   finding the total credits a student enrolled in a semester registration
  const enrolledCourses = await EnrolledCourseModel.aggregate([
    {
      $match: {
        semesterRegistration: offeredCourse.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourse',
      },
    },
    {
      $unwind: '$enrolledCourse',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourse.credit' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);

  const totalEnrolledCredits =
    enrolledCourses?.length > 0 ? enrolledCourses[0]?.totalEnrolledCredits : 0;

  // checking if the student has already enrolled in maximum credit
  if (
    totalEnrolledCredits &&
    semesterRegistration?.maxCredit &&
    totalEnrolledCredits + course?.credit > semesterRegistration?.maxCredit
  ) {
    throw new AppError(400, 'You have already enrolled in maximum credit');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: offeredCourse.semesterRegistration,
          academicDepartment: offeredCourse.academicDepartment,
          academicSemester: offeredCourse.academicSemester,
          academicFaculty: offeredCourse.academicFaculty,
          offeredCourse: payload.offeredCourse,
          course: offeredCourse.course,
          student: student._id,
          faculty: offeredCourse.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );
    if (!result) {
      throw new AppError(400, 'Enrolled course not created');
    }
    const maxCapacity = offeredCourse.maxCapacity;
    await OfferedCourseModel.findByIdAndUpdate(
      payload.offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { new: true, session },
    );
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(500, err.message);
  }
};

const updateMarksInDB = async (
  payload: Partial<TEnrolledCourse>,
  facultyId: string,
) => {
  const { semesterRegistration, offeredCourse, courseMarks, student } = payload;

  const isStudentExists = await StudentModel.findById(student);
  if (!isStudentExists) {
    throw new AppError(404, 'Student not found');
  }
  const isOfferedCourseExists =
    await OfferedCourseModel.findById(offeredCourse);
  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered course not found');
  }
  const isSemesterRegistrationExists =
    await semesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'Semester registration not found');
  }
  const isFacultyExists = await FacultyModel.findOne(
    { id: facultyId },
    { _id: 1 },
  );
  if (!isFacultyExists) {
    throw new AppError(404, 'Faculty not found');
  }
  const isTheCourseBelongToFaculty = await EnrolledCourseModel.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: isFacultyExists._id,
  });
  if (!isTheCourseBelongToFaculty) {
    throw new AppError(400, 'You are not allowed to update the marks');
  }
  const modifiedData: Record<string, unknown> = {};
  if (courseMarks && Object.keys(courseMarks).length > 0) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }
  if (courseMarks?.final) {
    const { classTest1, classTest2, mid, final } = courseMarks;
    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(classTest2) +
      Math.ceil(mid) +
      Math.ceil(final);
    const gradesAndPoints = calculateGradesAndPoints(totalMarks);
    modifiedData.grade = gradesAndPoints.grade;
    modifiedData.gradePoints = gradesAndPoints.gradePoints;
    modifiedData.isCompleted = true;
  }
  const result = EnrolledCourseModel.findByIdAndUpdate(
    isTheCourseBelongToFaculty._id,
    modifiedData,
    { new: true },
  );
  return result;
};
const getMyEnrolledCourseFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const enrolledCourse = new QueryBuilder(
    EnrolledCourseModel.find({ student: studentId }),
    query,
  )
    .sort()
    .paginate()
    .filter()
    .fields();
  const result = await enrolledCourse.modelQuery;
  return result;
};

const enrolledCourseServices = {
  createEnrolledCourseInDB,
  updateMarksInDB,
  getMyEnrolledCourseFromDB,
};

export default enrolledCourseServices;
