import { Router } from 'express';
import studentController from './student.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import { studentValidations } from './student.validation';

const router = Router();

router.get('/', studentController.getStudents);
router.get('/:id', studentController.getSingleStudent);
router.delete('/:id', studentController.deleteStudent);
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentController.updatedStudent,
);

export const studentRoutes = router;
