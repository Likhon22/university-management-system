import { Router } from 'express';

import { studentRoutes } from '../../modules/student/student.routes';
import { userRoutes } from '../../modules/user/user.routes';
import { academicSemesterRoutes } from '../../modules/academicSemester/academicSemester.route';
import { academicFacultyRoutes } from '../../modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../../modules/academicDepartment/academicDepartment.routes';

const routes = Router();

type Route = {
  path: string;
  routes: Router;
};

const moduleRoutes: Route[] = [
  {
    path: '/users',
    routes: userRoutes,
  },
  {
    path: '/students',
    routes: studentRoutes,
  },
  {
    path: '/academic-semester',
    routes: academicSemesterRoutes,
  },
  {
    path: '/academic-faculty',
    routes: academicFacultyRoutes,
  },
  {
    path: '/academic-department',
    routes: academicDepartmentRoutes,
  },
];

moduleRoutes.forEach(route => {
  routes.use(route.path, route.routes);
});

export default routes;
