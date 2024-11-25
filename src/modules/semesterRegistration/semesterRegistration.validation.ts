import { semesterRegistrationStatus } from './semesterRegistration.constants';
import { z } from 'zod';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z
      .enum([...semesterRegistrationStatus] as [string, ...string[]])
      .default('UPCOMING'),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number().default(3),
    maxCredit: z.number().default(15),
  }),
});

const updateSemesterRegistrationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...semesterRegistrationStatus] as [string, ...string[]])
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

const semesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationSchema,
};

export default semesterRegistrationValidations;
