// lib/zod.ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

// Optional: export the inferred TypeScript type
export type SignInInput = z.infer<typeof signInSchema>;
