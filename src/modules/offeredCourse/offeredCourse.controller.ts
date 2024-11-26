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

const offeredCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
};

export default offeredCourseControllers;
