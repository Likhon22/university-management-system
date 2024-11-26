import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import offeredCourseValidations from './offeredCourse.validation';
import offeredCourseControllers from './offeredCourse.controller';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);
router.patch(
  '/:id',
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);

export const offeredCourseRoutes = router;
