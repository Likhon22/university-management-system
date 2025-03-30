import { Router } from 'express';
import courseControllers from './course.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import courseValidations from './course.validation';
import auth from '../../app/middlewares/auth';
import { User_Role } from '../user/user.constants';

const router = Router();

router.post(
  '/create-course',
  auth(User_Role.admin),
  validateRequest(courseValidations.createCourseValidationSchema),
  courseControllers.createCourse,
);
router.get(
  '/',
  // auth(User_Role.admin, User_Role.faculty, User_Role.student),
  courseControllers.getCourses,
);
router.get('/:id', courseControllers.getSingleCourse);
router.delete('/:id', courseControllers.deleteCourse);
router.patch(
  '/:id',
  validateRequest(courseValidations.updateCourseValidationSchema),
  auth(User_Role.admin),
  courseControllers.updateCourse,
);
router.put(
  '/:id/assign-faculties',
  validateRequest(courseValidations.courseFacultyValidationSchema),
  courseControllers.assignFacultiesToCourse,
);
router.delete(
  '/:id/remove-faculties',
  auth(User_Role.admin),
  courseControllers.removeFacultiesFromCourse,
);

router.get(
  '/:id/faculties',
  // auth(User_Role.admin, User_Role.faculty, User_Role.student),
  courseControllers.getCourseFaculties,
);

export const courseRoutes = router;
