import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import semesterRegistrationValidations from './semesterRegistration.validation';
import semesterRegistrationControllers from './semesterRegistration.controller';

const router = Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    semesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  semesterRegistrationControllers.createSemesterRegistration,
);

router.get('/', semesterRegistrationControllers.getAllSemesterRegistrations);

router.get(
  '/:id',
  semesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  validateRequest(
    semesterRegistrationValidations.updateSemesterRegistrationSchema,
  ),
  semesterRegistrationControllers.updateSemesterRegistration,
);
export const semesterRegistrationRoutes = router;
