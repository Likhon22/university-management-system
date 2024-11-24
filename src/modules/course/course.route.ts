import { Router } from 'express';
import courseControllers from './course.controller';
import validateRequest from '../../app/middlewares/validateRequest';
import courseValidations from './course.validation';

const router = Router();

router.post(
  '/create-course',
  validateRequest(courseValidations.createCourseValidationSchema),
  courseControllers.createCourse,
);
router.get('/', courseControllers.getCourses);
router.get('/:id', courseControllers.getSingleCourse);
router.delete('/:id', courseControllers.deleteCourse);
router.patch(
  '/:id',
  validateRequest(courseValidations.updateCourseValidationSchema),
  courseControllers.updateCourse,
);
router.put(
  '/:id/assign-faculties',
  validateRequest(courseValidations.courseFacultyValidationSchema),
  courseControllers.assignFacultiesToCourse,
);

export const courseRoutes = router;
