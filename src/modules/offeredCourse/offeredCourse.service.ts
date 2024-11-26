import AppError from '../../app/error/AppError';
import AcademicDepartmentModel from '../academicDepartment/academicDepartment.model';
import AcademicFacultyModel from '../academicFaculty/academicFaculty.model';
import { CourseModel } from '../course/course.model';
import FacultyModel from '../faculty/faculty.model';
import { semesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model';
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
  console.log(semesterRegistrationStatus?.status);

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

const offeredCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
};

export default offeredCourseServices;
