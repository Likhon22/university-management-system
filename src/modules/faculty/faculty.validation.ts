import { z } from 'zod';
import { BloodGroup } from './faculty.constants';

const createNameValidationSchema = z.object({
  firstName: z.string().max(20),
  middleName: z.string().max(20).optional(),
  lastName: z.string().max(20),
});

const createFacultyValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6),
    faculty: z.object({
      name: createNameValidationSchema,
      email: z.string().email(),
      designation: z.string(),
      profileImg: z.string().url(),
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
    }),
  }),
});

// for updated student
const updateNameValidationSchema = z.object({
  firstName: z.string().max(20).optional(),
  middleName: z.string().max(20).optional(),
  lastName: z.string().max(20).optional(),
});

const updateFacultyValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateNameValidationSchema.optional(),
      email: z.string().email().optional(),
      designation: z.string().optional(),
      profileImg: z.string().url().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
    }),
  }),
});

export const facultyValidations = {
  createFacultyValidationSchema,
  updateFacultyValidationSchema,
};
