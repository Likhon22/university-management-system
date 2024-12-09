import { userServices } from './user.service';
import sendResponse from '../../app/utils/sendResponse';

import catchAsync from '../../app/utils/catchAsync';
import AppError from '../../app/error/AppError';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  const studentData = await userServices.createStudentsIntoDB(
    req?.file,
    password,
    student,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: studentData,
    message: 'Student created successfully',
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty } = req.body;

  const facultyData = await userServices.createFacultyIntoDB(password, faculty);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: facultyData,
    message: 'Faculty created successfully',
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;

  const adminData = await userServices.createAdminIntoDB(password, admin);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: adminData,
    message: 'Admin created successfully',
  });
});
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user;
  if (!userId) {
    throw new AppError(400, 'Invalid token');
  }
  const result = await userServices.getMeFromDB(userId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
    message: 'User fetched successfully',
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await userServices.changeStatusFromDB(id, req.body.status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result,
    message: 'Status changed successfully',
  });
});
export const userController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
