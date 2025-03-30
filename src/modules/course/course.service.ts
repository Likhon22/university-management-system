/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../app/builder/QueryBuilder';
import { courseSearchableFields } from './course.constants';
import { TCourse, TCourseFaculty } from './course.interface';
import { CourseFacultyModel, CourseModel } from './course.model';
import AppError from '../../app/error/AppError';
import client from '../../app/DB/client';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getCoursesFromDB = async (query: Record<string, unknown>) => {
  const cacheValue = await client.get('courses');
  if (cacheValue) {
    const courses = JSON.parse(cacheValue);
    return courses;
  }
  const courseQuery = new QueryBuilder(
    CourseModel.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const courses = await courseQuery.modelQuery;
  await client.set('courses', JSON.stringify(courses));
  await client.expire('courses', 60 * 60); // Set cache expiration to 1 hour
  return courses;
};
const getSingleCourseFromDB = async (id: string) => {
  const course = await CourseModel.findById({ _id: id }).populate(
    'preRequisiteCourses.course',
  );
  return course;
};
const deleteCourseFromDB = async (id: string) => {
  const course = await CourseModel.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true },
  );
  return course;
};

const updateCourseFromDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // update basic course
    const updatedBasicCourse = CourseModel.findByIdAndUpdate(
      { _id: id },
      remainingCourseData,
      { new: true, runValidators: true, session },
    );

    if (!updatedBasicCourse) {
      session.abortTransaction();
      session.endSession();
      throw new AppError(404, 'failed to update course ');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted course
      const deletedPreRequisite = preRequisiteCourses
        .filter(el => el.course && el.isDeleted === true)
        .map(el => el.course);

      const deletedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        { _id: id },
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisite } },
          },
        },
        { new: true, runValidators: true, session },
      );
      if (!deletedPreRequisiteCourses) {
        throw new AppError(404, 'failed to update course ');
      }
      // filter out the updated course
      const updatedPreRequisite = preRequisiteCourses.filter(
        el => el.course && el.isDeleted === false,
      );

      const updatedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        { _id: id },
        {
          $addToSet: {
            preRequisiteCourses: { $each: updatedPreRequisite },
          },
        },
        { new: true, runValidators: true, session },
      );
      if (!updatedPreRequisiteCourses) {
        throw new AppError(404, 'failed to update course ');
      }
      const result = await CourseModel.findById({ _id: id }).populate(
        'preRequisiteCourses.course',
      );
      return result;
    }

    session.commitTransaction();
    session.endSession();
  } catch (error: any) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(400, error.message);
  }
};

const assignFacultiesToCourse = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = CourseFacultyModel.findByIdAndUpdate(
    id,

    { course: id, $addToSet: { faculties: { $each: payload } } },
    { upsert: true, new: true, runValidators: true },
  );

  return result;
};
const removeFacultiesFromCourse = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { new: true },
  );

  return result;
};

const getCourseFacultiesFromDB = async (courseId: string) => {
  const faculties = await CourseFacultyModel.findOne({
    course: courseId,
  }).populate('faculties');
  return faculties;
};

const courseServices = {
  createCourseIntoDB,
  getCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseFromDB,
  deleteCourseFromDB,
  assignFacultiesToCourse,
  removeFacultiesFromCourse,
  getCourseFacultiesFromDB,
};
export default courseServices;
