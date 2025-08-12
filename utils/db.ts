// utils/db.ts
import { db } from '@/prisma/db';
import { verifyPassword } from './auth'; // Make sure this is implemented correctly



export interface User {
  id: number;
  email: string;
  name?: string | null;
  role: string;
}

export const getUserFromDb = async (
  email: string,
  password: string
): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (user && user?.password && (await verifyPassword(password, user.password))) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  return null;
};
