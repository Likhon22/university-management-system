import { z } from 'zod';
import { User_Status } from './user.constants';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'password must be string' })
    .max(20, {
      message: 'Password should not be more than 20 characters long',
    })
    .optional(),
});
const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...User_Status] as [string, ...string[]]),
  }),
});

const userValidations = {
  userValidationSchema,
  changeStatusValidationSchema,
};
export default userValidations;
