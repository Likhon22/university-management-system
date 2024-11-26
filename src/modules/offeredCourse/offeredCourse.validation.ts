import { z } from 'zod';
import { Days } from './offeredCourse.constants';

const timeStringSchema = z.string().refine(
  time => {
    const regex = /^([0-9]|[01]\d|2[0-3]):([0-5]\d)$/;

    return regex.test(time);
  },
  { message: 'Time must be in HH:MM format' },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      body => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return start < end;
      },
      { message: 'Start time must be before end time' },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object(
      {
        faculty: z.string(),
        maxCapacity: z.number(),
        days: z.array(z.enum([...Days] as [string, ...string[]])),
        startTime: timeStringSchema,
        endTime: timeStringSchema,
      },
      { message: 'Start time must be before end time' },
    )
    .refine(
      body => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return start < end;
      },
      { message: 'Start time must be before end time' },
    ),
});

const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};

export default offeredCourseValidations;
