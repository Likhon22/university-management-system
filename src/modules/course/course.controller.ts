import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import courseServices from './course.service';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { course } = req.body;

  const newCourse = await courseServices.createCourseIntoDB(course);
  sendResponse(res, {
    data: newCourse,
    message: 'Course created successfully',
    statusCode: 200,
    success: true,
  });
});

const getCourses = catchAsync(async (req: Request, res: Response) => {
  const courses = await courseServices.getCoursesFromDB(req.query);
  sendResponse(res, {
    data: courses,
    message: 'Courses fetched successfully',
    statusCode: 200,
    success: true,
  });
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const course = await courseServices.getSingleCourseFromDB(id);
  sendResponse(res, {
    data: course,
    message: 'Course fetched successfully',
    statusCode: 200,
    success: true,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { course } = req.body;
  const updatedCourse = await courseServices.updateCourseFromDB(id, course);
  sendResponse(res, {
    data: updatedCourse,
    message: 'Course updated successfully',
    statusCode: 200,
    success: true,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const course = await courseServices.deleteCourseFromDB(id);
  sendResponse(res, {
    data: course,
    message: 'Course deleted successfully',
    statusCode: 200,
    success: true,
  });
});

const assignFacultiesToCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const faculties = req.body;
    console.log(faculties, id);

    const result = await courseServices.assignFacultiesToCourse(id, faculties);
    sendResponse(res, {
      data: result,
      message: 'Faculties assigned to course successfully',
      statusCode: 200,
      success: true,
    });
  },
);

const courseControllers = {
  createCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesToCourse,
};
export default courseControllers;
