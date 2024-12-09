import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import enrolledCourseServices from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await enrolledCourseServices.createEnrolledCourseInDB(
    req.body,
    userId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
    message: 'Enrolled course created successfully',
  });
});

const updateMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId;
  const result = await enrolledCourseServices.updateMarksInDB(
    req.body,
    facultyId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
    message: 'Marks updated successfully',
  });
});

const enrolledCourseControllers = {
  createEnrolledCourse,
  updateMarks,
};

export default enrolledCourseControllers;
