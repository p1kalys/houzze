const { z } = require('zod');

// Validator for registration
const registerValidator = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Validator for login
const loginValidator = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

module.exports = { registerValidator, loginValidator };
