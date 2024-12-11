import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import offeredCourseServices from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const offeredCourseData = req.body;
  const offeredCourse =
    await offeredCourseServices.createOfferedCourseIntoDB(offeredCourseData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course created successfully',
    data: offeredCourse,
  });
});
const getAllOfferedCourses = catchAsync(async (req, res) => {
  const offeredCourses =
    await offeredCourseServices.getAllOfferedCoursesFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered courses fetched successfully',
    data: offeredCourses,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  const result = await offeredCourseServices.updateOfferedCourseIntoDB(
    id,
    updateData,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course updated successfully',
    data: result,
  });
});
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await offeredCourseServices.getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course fetched successfully',
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await offeredCourseServices.deleteOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course deleted successfully',
    data: result,
  });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
  const userId = req.user.userId;

  const result = await offeredCourseServices.getMyOfferedCoursesFromDB(
    userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered course fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const offeredCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
  getAllOfferedCourses,
  deleteOfferedCourse,
  getSingleOfferedCourse,
  getMyOfferedCourses,
};

export default offeredCourseControllers;
