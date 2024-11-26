import { Router } from 'express';

import { studentRoutes } from '../../modules/student/student.routes';
import { userRoutes } from '../../modules/user/user.routes';
import { academicSemesterRoutes } from '../../modules/academicSemester/academicSemester.route';
import { academicFacultyRoutes } from '../../modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoutes } from '../../modules/academicDepartment/academicDepartment.routes';
import { facultyRoutes } from '../../modules/faculty/faculty.route';
import { courseRoutes } from '../../modules/course/course.route';
import { adminRoutes } from '../../modules/admin/admin.routes';
import { semesterRegistrationRoutes } from '../../modules/semesterRegistration/semesterRegistration.routes';
import { offeredCourseRoutes } from '../../modules/offeredCourse/offeredCourse.route';

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
  {
    path: '/faculties',
    routes: facultyRoutes,
  },
  {
    path: '/admins',
    routes: adminRoutes,
  },
  {
    path: '/courses',
    routes: courseRoutes,
  },
  {
    path: '/semester-registrations',
    routes: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    routes: offeredCourseRoutes,
  },
];

moduleRoutes.forEach(route => {
  routes.use(route.path, route.routes);
});

export default routes;
