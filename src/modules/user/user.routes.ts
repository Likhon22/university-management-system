import { Router } from 'express';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../app/middlewares/validateRequest';
import { userController } from './user.controller';

const router = Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  userController.saveStudent,
);

export const userRoutes = router;
