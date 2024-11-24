import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import adminServices from './admin.service';
import sendResponse from '../../app/utils/sendResponse';

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const adminData = await adminServices.getAllAdminsFromDB(req?.query);
  sendResponse(res, {
    data: adminData,
    message: 'Admins fetched successfully',
    statusCode: 200,
    success: true,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const adminData = await adminServices.getSingleAdminFromDB(id);
  sendResponse(res, {
    data: adminData,
    message: 'Admin fetched successfully',
    statusCode: 200,
    success: true,
  });
});

const adminController = {
  getAllAdmins,
  getSingleAdmin,
};
export default adminController;
