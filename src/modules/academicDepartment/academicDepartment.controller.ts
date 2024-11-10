import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import academicDepartmentService from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const academicDepartmentData = req.body;
  const newAcademicDepartment =
    await academicDepartmentService.createAcademicDepartmentIntoDB(
      academicDepartmentData,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department created successfully',
    data: newAcademicDepartment,
  });
});

const getAcademicDepartments = catchAsync(async (req, res) => {
  const departments =
    await academicDepartmentService.getAcademicDepartmentsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Departments fetched successfully',
    data: departments,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const department =
    await academicDepartmentService.getSingleAcademicDepartmentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department fetched successfully',
    data: department,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await academicDepartmentService.updateAcademicDepartmentInDB(
    id,
    updatedData,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department updated successfully',
    data: result,
  });
});

const academicDepartmentController = {
  createAcademicDepartment,
  getAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};

export default academicDepartmentController;
