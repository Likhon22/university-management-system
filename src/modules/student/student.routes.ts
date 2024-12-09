import { Router } from 'express';
import studentController from './student.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { studentValidations } from './student.validation';
import { User_Role } from '../user/user.constants';
import auth from '../../app/middlewares/auth';

const router = Router();

router.get('/', studentController.getStudents);
router.get(
  '/:id',
  auth(User_Role.admin, User_Role.faculty, User_Role.student),
  studentController.getSingleStudent,
);
router.delete('/:id', studentController.deleteStudent);
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentController.updatedStudent,
);

export const studentRoutes = router;
