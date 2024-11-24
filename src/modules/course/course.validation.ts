import { z } from 'zod';

const createPrerequisiteCourseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});
const createCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string(),
      prefix: z.string(),
      code: z.number(),
      credit: z.number(),
      preRequisiteCourses: z
        .array(createPrerequisiteCourseValidationSchema)
        .optional(),
    }),
  }),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string().optional(),
      prefix: z.string().optional(),
      code: z.number().optional(),
      credit: z.number().optional(),
      preRequisiteCourses: z
        .array(createPrerequisiteCourseValidationSchema)
        .optional(),
    }),
  }),
});

const courseFacultyValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

const courseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  courseFacultyValidationSchema,
};

export default courseValidations;
