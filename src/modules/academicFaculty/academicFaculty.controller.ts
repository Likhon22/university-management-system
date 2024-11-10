import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import academicFacultyServices from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const academicFacultyData = req.body;
  const result =
    await academicFacultyServices.createAcademicFacultyIntoDB(
      academicFacultyData,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Faculty created successfully',
    data: result,
  });
});

const getAcademicFaculties = catchAsync(async (req, res) => {
  const faculties = await academicFacultyServices.getAcademicFacultiesFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Faculties fetched successfully',
    data: faculties,
  });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const faculty =
    await academicFacultyServices.getSingleAcademicFacultyFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic faculty fetched successfully',
    data: faculty,
  });
});

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await academicFacultyServices.updatedAcademicFacultyInDB(
    id,
    updatedData,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic faculty updated successfully',
    data: result,
  });
});

const academicFacultyControllers = {
  createAcademicFaculty,
  getAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};

export default academicFacultyControllers;
