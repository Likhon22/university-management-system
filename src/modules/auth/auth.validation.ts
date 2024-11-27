import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'id is required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'oldPassword is required' }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});

const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
};

export default authValidations;
