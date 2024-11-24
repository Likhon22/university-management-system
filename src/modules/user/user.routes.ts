import { Router } from 'express';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../app/middlewares/validateRequest';
import { userController } from './user.controller';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';

const router = Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userController.createFaculty,
);
router.post(
  '/create-admin',
  validateRequest(adminValidations.createAdminValidationSchema),
  userController.createAdmin,
);

export const userRoutes = router;
