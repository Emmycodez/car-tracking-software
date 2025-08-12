// utils/auth.ts
import bcrypt from 'bcrypt';

/**
 * Compares a plain password with its hashed version.
 * @param plainPassword - the plain text password from user input
 * @param hashedPassword - the hashed password stored in the DB
 * @returns true if the passwords match, false otherwise
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
