import { Router } from 'express';
import academicSemesterController from './academicSemester.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import academicSemesterValidations from './academicSemester.validation';
import auth from '../../app/middlewares/auth';
import { User_Role } from '../user/user.constants';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    academicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  academicSemesterController.createAcademicSemester,
);
router.get(
  '/',
  auth(User_Role.admin),
  academicSemesterController.getAcademicSemesters,
);
router.get('/:id', academicSemesterController.getSingleAcademicSemester);
router.patch(
  '/:semesterId',
  validateRequest(
    academicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  academicSemesterController.updateAcademicSemester,
);

export const academicSemesterRoutes = router;
