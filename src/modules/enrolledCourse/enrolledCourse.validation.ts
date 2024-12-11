import { z } from 'zod';

const createEnrolledCourseValidation = z.object({
  body: z.object({
    offeredCourse: z.string(),
  }),
});

const marksValidation = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    offeredCourse: z.string(),
    student: z.string(),
    courseMarks: z.object({
      classTest1: z.number().min(0).max(10).optional(),
      classTest2: z.number().min(0).max(10).optional(),
      mid: z.number().min(0).max(30).optional(),
      final: z.number().min(0).max(50).optional(),
    }),
  }),
});

const enrolledCourseValidation = {
  createEnrolledCourseValidation,
  marksValidation,
};
export default enrolledCourseValidation;
