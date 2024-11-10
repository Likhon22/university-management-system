import { z } from 'zod';

const createAcademicDepartmentValidation = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'name must be a string',
      required_error: 'name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'academicFaculty must be a string',
      required_error: 'academicFaculty is required',
    }),
  }),
});
const updateAcademicDepartmentValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    academicFaculty: z.string().optional(),
  }),
});

const academicDepartmentValidation = {
  createAcademicDepartmentValidation,
  updateAcademicDepartmentValidation,
};

export default academicDepartmentValidation;
