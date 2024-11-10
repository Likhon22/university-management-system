import { userServices } from './user.service';
import sendResponse from '../../app/utils/sendResponse';

import catchAsync from '../../app/utils/catchAsync';

const saveStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  // const zodParsedData = studentValidationSchema.parse(student);
  const studentData = await userServices.saveStudentsIntoDB(password, student);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: studentData,
    message: 'Student created successfully',
  });
});
export const userController = {
  saveStudent,
};
