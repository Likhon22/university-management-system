import { Router } from 'express';
import enrolledCourseControllers from './enrolledCourse.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import enrolledCourseValidation from './enrolledCourse.validation';
import auth from '../../app/middlewares/auth';
import { User_Role } from '../user/user.constants';

const router = Router();

router.post(
  '/create-enrolled-course',
  auth(User_Role.student),
  validateRequest(enrolledCourseValidation.createEnrolledCourseValidation),
  enrolledCourseControllers.createEnrolledCourse,
);
router.patch(
  '/update-marks',
  auth(User_Role.faculty),
  validateRequest(enrolledCourseValidation.marksValidation),
  enrolledCourseControllers.updateMarks,
);

export const enrolledCourseRoutes = router;
