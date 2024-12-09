import { Router } from 'express';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../app/middlewares/validateRequest';
import { userController } from './user.controller';
import { facultyValidations } from '../faculty/faculty.validation';
import { adminValidations } from '../admin/admin.validation';
import auth from '../../app/middlewares/auth';
import { User_Role } from './user.constants';
import userValidations from './user.validation';
import { upload } from '../../app/utils/sendImageToCloudinary';
import parseBodyData from '../../app/middlewares/parseBodyData';

const router = Router();

router.post(
  '/create-student',
  // auth(User_Role.admin),

  upload.single('file'),
  parseBodyData,
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.createStudent,
);
router.post(
  '/create-faculty',
  auth(User_Role.admin),
  validateRequest(facultyValidations.createFacultyValidationSchema),
  userController.createFaculty,
);
router.post(
  '/create-admin',
  // auth(User_Role.admin),

  validateRequest(adminValidations.createAdminValidationSchema),
  userController.createAdmin,
);
router.get(
  '/get-me',
  auth(User_Role.admin, User_Role.faculty, User_Role.student),
  userController.getMe,
);

router.patch(
  '/change-status/:id',
  auth(User_Role.admin),
  validateRequest(userValidations.changeStatusValidationSchema),
  userController.changeStatus,
);

export const userRoutes = router;
