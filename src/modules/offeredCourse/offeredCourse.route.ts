import { Router } from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import offeredCourseValidations from './offeredCourse.validation';
import offeredCourseControllers from './offeredCourse.controller';
import auth from '../../app/middlewares/auth';
import { User_Role } from '../user/user.constants';

const router = Router();

router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  offeredCourseControllers.createOfferedCourse,
);


router.get('/', offeredCourseControllers.getAllOfferedCourses);
router.get(
  '/my-offered-course',
  auth(User_Role.student),
  offeredCourseControllers.getMyOfferedCourses,
);
router.get('/:id', offeredCourseControllers.getSingleOfferedCourse);
router.delete('/:id', offeredCourseControllers.deleteOfferedCourse);
router.patch(
  '/:id',
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  offeredCourseControllers.updateOfferedCourse,
);

export const offeredCourseRoutes = router;
