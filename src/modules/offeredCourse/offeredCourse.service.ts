import AppError from '../../app/error/AppError';
import AcademicDepartmentModel from '../academicDepartment/academicDepartment.model';
import AcademicFacultyModel from '../academicFaculty/academicFaculty.model';
import { CourseModel } from '../course/course.model';
import FacultyModel from '../faculty/faculty.model';
import { semesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
import StudentModel from '../student/student.model';
import { TOfferedCourse } from './offeredCourse.interface';
import OfferedCourseModel from './offeredCourse.model';
import { hasTimeConflicts } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  // check if the semester registration exists
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    section,
    days,
    startTime,
    endTime,
    faculty,
  } = payload;
  const isSemesterRegistrationExists =
    await semesterRegistrationModel.findById(semesterRegistration);
  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'Semester registration does not exist');
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty);
  if (!isAcademicFacultyExists) {
    throw new AppError(404, 'AcademicFaculty  does not exist');
  }
  const isAcademicDepartmentExists =
    await AcademicDepartmentModel.findById(academicDepartment);
  if (!isAcademicDepartmentExists) {
    throw new AppError(404, 'AcademicDepartment does not exist');
  }
  const isCourseExists = await CourseModel.findById(course);
  if (!isCourseExists) {
    throw new AppError(404, 'Course does not exist');
  }
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(404, 'Faculty does not exist');
  }
  //   check if the department belongs to the academic faculty department

  const isDepartmentBelongsToFaculty = await AcademicDepartmentModel.findOne({
    academicFaculty,
    _id: academicDepartment,
  });
  if (!isDepartmentBelongsToFaculty) {
    throw new AppError(
      400,
      `${isAcademicDepartmentExists.name} does not belong to the  ${isAcademicFacultyExists.name}`,
    );
  }

  //   check if the same offered-course same section in same registered semester exists
  const isOfferedCourseWithSameSectionInSameRegistrationSemesterExists =
    await OfferedCourseModel.findOne({ course, section, semesterRegistration });
  if (isOfferedCourseWithSameSectionInSameRegistrationSemesterExists) {
    throw new AppError(
      400,
      `Offered course with same section in same semester registration already exists`,
    );
  }

  //   get the schedules of the faculty
  const facultySchedules = await OfferedCourseModel.find(
    {
      semesterRegistration,
      faculty,
      days: { $in: days },
    },
    { days: 1, startTime: 1, endTime: 1 },
  );

  const existingSchedules = {
    days,
    startTime,
    endTime,
  };

  const schedule = hasTimeConflicts(facultySchedules, existingSchedules);
  if (schedule) {
    throw new AppError(400, 'Faculty Time conflicts with existing schedules');
  }

  const newOfferedCourse = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return newOfferedCourse;
};

const getAllOfferedCoursesFromDB = async () => {
  const offeredCourses =
    await OfferedCourseModel.find().populate('course faculty');
  return offeredCourses;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse =
    await OfferedCourseModel.findById(id).populate('course faculty');
  return offeredCourse;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered Course not found');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await semesterRegistrationModel
    .findById(semesterRegistration)
    .select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      400,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    );
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id);

  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const faculty = payload.faculty;
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered course does not exist');
  }
  const isFacultyExists = await FacultyModel.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(404, 'Faculty does not exist');
  }
  const semesterRegistration = isOfferedCourseExists.semesterRegistration;
  const assignedSchedules = await OfferedCourseModel.find({
    faculty,
    semesterRegistration,
    days: { $in: payload.days },
  }).select('days startTime endTime');

  const newSchedules = {
    days: payload.days,
    startTime: payload.startTime,
    endTime: payload.endTime,
  };
  const timeConflicts = hasTimeConflicts(assignedSchedules, newSchedules);
  if (timeConflicts) {
    throw new AppError(
      400,
      'Faculty has Time conflicts with existing schedules',
    );
  }
  // check if the semester is upcoming or not
  const semesterRegistrationStatus = await semesterRegistrationModel.findById(
    semesterRegistration,
    { status: 1 },
  );

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      400,
      `Semester is not upcoming.It is already ${semesterRegistrationStatus?.status}`,
    );
  }
  const result = await OfferedCourseModel.findById(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  const student = await StudentModel.findOne({ id: userId });
  if (!student) {
    throw new AppError(404, 'Student not found');
  }
  const currentOnGoingSemester = await semesterRegistrationModel.findOne({
    status: 'ONGOING',
  });
  if (!currentOnGoingSemester) {
    throw new AppError(404, 'No ongoing semester registration found');
  }

  const aggregateQuery = [
    {
      $match: {
        semesterRegistration: currentOnGoingSemester._id,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOnGoingSemester: currentOnGoingSemester._id,
          student: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$semesterRegistration', '$$currentOnGoingSemester'],
                  },
                  {
                    $eq: ['$student', '$$student'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
          {
            $project: {
              course: 1,
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          student: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$student'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPrerequisitesFulfilled: {
          $or: [
            {
              $eq: ['$course.preRequisiteCourses', []],
            },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedIds',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPrerequisitesFulfilled: true,
      },
    },
  ];
  const page = parseInt(query?.page as string) || 1;
  const limit = parseInt(query?.limit as string) || 10;
  const skip = (page - 1) * limit;
  const paginateQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
  const result = await OfferedCourseModel.aggregate([
    ...aggregateQuery,
    ...paginateQuery,
  ]);
  const totalDocuments = (await OfferedCourseModel.aggregate(aggregateQuery))
    .length;

  const totalPage = Math.ceil(totalDocuments / limit);
  const meta = {
    totalDocuments,
    totalPage,
    page,
    limit,
  };

  return { result, meta };
};

const offeredCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
  getMyOfferedCoursesFromDB,
};

export default offeredCourseServices;
