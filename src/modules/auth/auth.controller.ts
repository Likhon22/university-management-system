import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';

import authServices from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  sendResponse(res, {
    data: result,
    message: 'Login successful',
    statusCode: 200,
    success: true,
  });
});
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await authServices.changePassword(req.user, passwordData);

  sendResponse(res, {
    data: result,
    message: 'Password change successful',
    statusCode: 200,
    success: true,
  });
});

const authControllers = {
  loginUser,
  changePassword,
};

export default authControllers;
