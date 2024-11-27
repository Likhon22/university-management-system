import { Router } from 'express';
import facultyController from './faculty.controller';
import auth from '../../app/middlewares/auth';
import { User_Role } from '../user/user.constants';

const router = Router();

router.get(
  '/',
  auth(User_Role.admin, User_Role.faculty),
  facultyController.getFaculties,
);
router.get('/:id', facultyController.getSingleFaculty);
router.patch('/:id', facultyController.updateFaculty);
router.delete('/:id', facultyController.deleteFaculty);

export const facultyRoutes = router;
