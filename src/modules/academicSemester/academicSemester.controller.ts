import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import academicSemesterServices from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const semesterData = req.body;
  const newSemester =
    await academicSemesterServices.createAcademicSemesterIntoDB(semesterData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic semester created successfully',
    data: newSemester,
  });
});

const getAcademicSemesters = catchAsync(async (req, res) => {
  const semesters = await academicSemesterServices.getAcademicSemestersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic semesters fetched successfully',
    data: semesters,
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const id = req.params.id;
  const semester =
    await academicSemesterServices.getSingleAcademicSemesterFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic semester fetched successfully',
    data: semester,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const id = req.params.semesterId;
  const semesterData = req.body;

  const updatedSemester =
    await academicSemesterServices.updateAcademicSemesterIntoDB(
      id,
      semesterData,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic semester updated successfully',
    data: updatedSemester,
  });
});

const academicSemesterController = {
  createAcademicSemester,
  getAcademicSemesters,
  getSingleAcademicSemester,
  updateAcademicSemester,
};

export default academicSemesterController;
