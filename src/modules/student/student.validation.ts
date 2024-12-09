import { z } from 'zod';
import { BloodGroup } from './student.constants';

const createNameValidationSchema = z.object({
  firstName: z.string().max(20),
  middleName: z.string().max(20),
  lastName: z.string().max(20),
});

const createGuardianValidationSchema = z.object({
  fatherName: z.string().max(20),
  fatherOccupation: z.string().max(20),
  fatherContactNo: z.string(),
  motherName: z.string().max(20),
  motherOccupation: z.string().max(20),
  motherContactNo: z.string(),
});

const createLocalGuardianValidationSchema = z.object({
  name: z.string().max(20),
  occupation: z.string().max(20),
  contactNo: z.string(),
  address: z.string(),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().min(6),
    student: z.object({
      name: createNameValidationSchema,
      email: z.string().email(),
      gender: z.enum(['male', 'female', 'other']),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
    }),
  }),
});

// for updated student
const updateNameValidationSchema = z.object({
  firstName: z.string().max(20).optional(),
  middleName: z.string().max(20).optional(),
  lastName: z.string().max(20).optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().max(20).optional(),
  fatherOccupation: z.string().max(20).optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().max(20).optional(),
  motherOccupation: z.string().max(20).optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().max(20).optional(),
  occupation: z.string().max(20).optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});
const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateNameValidationSchema.optional(),
      email: z.string().email().optional(),
      profileImg: z.string().url().optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      dateOfBirth: z.string().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
