import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import semesterRegistrationServices from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistration = req.body;
  const result =
    await semesterRegistrationServices.createSemesterRegistrationIntoDB(
      semesterRegistration,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration created successfully',
    data: result,
  });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const query = req.query;
  const result =
    await semesterRegistrationServices.getAllSemesterRegistrationsFromDB(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registrations fetched successfully',
    data: result,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result =
    await semesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration fetched successfully',
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const id = req.params.id;
  const semesterRegistration = req.body;
  const result =
    await semesterRegistrationServices.updateSemesterRegistrationIntoDB(
      id,
      semesterRegistration,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration updated successfully',
    data: result,
  });
});

const semesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
};

export default semesterRegistrationControllers;
