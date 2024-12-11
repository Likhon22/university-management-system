import studentServices from './student.service';
import sendResponse from '../../app/utils/sendResponse';
import catchAsync from '../../app/utils/catchAsync';

const getStudents = catchAsync(async (req, res) => {
  const students = await studentServices.getStudentsFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: students.result,
    meta: students.meta,

    message: 'Students fetched successfully',
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const id = req.params.id;

  const student = await studentServices.getSingleStudentFromDB(id);
  if (!student) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      data: null,
      message: 'Student not found!!',
    });
    return;
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: student,
    message: 'Student fetched successfully',
  });
});

const updatedStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { student } = req.body;
  const updatedStudent = await studentServices.updateStudentFromDB(id, student);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: updatedStudent,
    message: 'Student updated successfully',
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const student = await studentServices.deleteStudentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: student,
    message: 'Student deleted successfully',
  });
});

const studentController = {
  getStudents,
  getSingleStudent,
  deleteStudent,
  updatedStudent,
};

export default studentController;
