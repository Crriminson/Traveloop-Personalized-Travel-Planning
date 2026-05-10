const { z } = require('zod');

const registerSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least 1 uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least 1 number' }),

  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be at most 100 characters' }),
});

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' }),

  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

module.exports = { registerSchema, loginSchema };
