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
      classTest1: z.number().optional(),
      classTest2: z.number().optional(),
      mid: z.number().optional(),
      final: z.number().optional(),
    }),
  }),
});

const enrolledCourseValidation = {
  createEnrolledCourseValidation,
  marksValidation,
};
export default enrolledCourseValidation;
