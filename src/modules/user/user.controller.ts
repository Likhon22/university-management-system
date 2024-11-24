import { userServices } from './user.service';
import sendResponse from '../../app/utils/sendResponse';

import catchAsync from '../../app/utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, student } = req.body;

  // const zodParsedData = studentValidationSchema.parse(student);
  const studentData = await userServices.createStudentsIntoDB(
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
export const userController = {
  createStudent,
  createFaculty,
  createAdmin,
};
