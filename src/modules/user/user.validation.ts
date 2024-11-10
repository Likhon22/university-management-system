import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'password must be string' })
    .max(20, {
      message: 'Password should not be more than 20 characters long',
    })
    .optional(),
});

export default userValidationSchema;
