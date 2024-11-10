import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import academicFacultyValidation from './academicFaculty.validation';
import academicFacultyControllers from './academicFaculty.controller';

const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(academicFacultyValidation.createAcademicFacultyValidation),
  academicFacultyControllers.createAcademicFaculty,
);

router.get('/', academicFacultyControllers.getAcademicFaculties);

router.get('/:id', academicFacultyControllers.getSingleAcademicFaculty);
router.patch(
  '/:id',
  validateRequest(academicFacultyValidation.updateAcademicFacultyValidation),
  academicFacultyControllers.updateAcademicFaculty,
);

export const academicFacultyRoutes = router;
