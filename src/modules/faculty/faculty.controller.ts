import { Request, Response } from 'express';
import facultyServices from './faculty.service';
import sendResponse from '../../app/utils/sendResponse';
import AppError from '../../app/error/AppError';
import catchAsync from '../../app/utils/catchAsync';

const getFaculties = catchAsync(async (req: Request, res: Response) => {
  const faculties = await facultyServices.getFacultyFromDB(req?.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: faculties,
    message: 'Faculties fetched successfully',
  });
});

const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const faculty = await facultyServices.getSingleFacultyFromDB(id);

  if (!faculty) {
    throw new AppError(404, 'Faculty not found');
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: faculty,
    message: 'Faculty fetched successfully',
  });
});
const updateFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const faculty = await facultyServices.updateFacultyFromDB(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: faculty,
    message: 'Faculty updated successfully',
  });
});
const deleteFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const faculty = await facultyServices.deleteFacultyFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: faculty,
    message: 'Faculty deleted successfully',
  });
});

const facultyController = {
  getFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
export default facultyController;
