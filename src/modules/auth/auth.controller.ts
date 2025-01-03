import config from '../../app/config';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';

import authServices from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await authServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  sendResponse(res, {
    data: {
      accessToken,
      needsPasswordChange,
      refreshToken,
    },
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

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(res, {
    data: result,
    message: 'Token refreshed successfully',
    statusCode: 200,
    success: true,
  });
});

const forgottenPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await authServices.forgetPassword(userId);
  sendResponse(res, {
    data: result,
    message: 'Reset link generated successfully',
    statusCode: 200,
    success: true,
  });
});
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await authServices.resetPassword(req.body, token as string);
  sendResponse(res, {
    data: result,
    message: 'Password reset successfully',
    statusCode: 200,
    success: true,
  });
});

const authControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgottenPassword,
  resetPassword,
};

export default authControllers;
