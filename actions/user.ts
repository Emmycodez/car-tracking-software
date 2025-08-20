'use server'

import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import bcrypt from "bcrypt";
import * as z from "zod";
import { saltAndHashPassword } from "@/utils/password";
import { callTraccarAdminApi } from "@/config/callTraccarAdminApi";

export async function createUser (data: UserProps) {
  const {email, password, name} = data;
  try {
    if (!password) {
  throw new Error("Password is required");
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        error: `Email already exists`,
        status: 409,
        data: null,
      };
    };

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
    });

    return {
      error: null,
      status: 200,
      data: newUser
    };
  }catch (error) {
    console.log(error);
    return {
      error: `Something Went Wrong, Please try again`,
      status: 500,
      data: null,
    };
  }

}





// Define a schema for validating the password input
const PasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters long.")
  .max(100, "Password cannot exceed 100 characters."); 


export async function updateUserPassword(userId: number, passwordInput: string) {
  try {
    // 1. Validate the incoming password
    const validatedPassword = PasswordSchema.safeParse(passwordInput);

    if (!validatedPassword.success) {
      return {
        success: false,
        error: validatedPassword.error.message,
      };
    }
    
    // 2. Find the user in the local database to get Traccar ID and email
    const userToUpdate = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, traccarId: true }, // Include 'name' for Traccar update
    });

    if (!userToUpdate) {
      return {
        success: false,
        error: "User not found or invalid activation.",
      };
    }

    // 3. Hash the password securely for your Prisma DB
    const hashedPassword = await saltAndHashPassword(validatedPassword.data);

    // 4. Update the user's password in Traccar
    if (userToUpdate.traccarId) {
      try {
        // A. Fetch the existing user data from Traccar
        const existingTraccarUser = await callTraccarAdminApi(`users/${userToUpdate.traccarId}`, 'GET');
        
        // B. Merge the new password and other necessary fields into the existing data
        // Ensure that 'name' and other required fields are always present.
        const updatedTraccarUserPayload = {
          ...existingTraccarUser, // Start with all existing Traccar user properties
          id: parseInt(userToUpdate.traccarId), // Ensure ID is correct and parsed
          email: userToUpdate.email, // Use email from your local DB as source of truth
          name: userToUpdate.name || existingTraccarUser.name || 'Default Name', // Use local name, or existing Traccar name, or a default
          password: validatedPassword.data, 
        };

        // C. Send the complete updated object to Traccar using PUT
        await callTraccarAdminApi(
          `users/${userToUpdate.traccarId}`, 
          'PUT',
          updatedTraccarUserPayload
        );
        console.log(`User ${userToUpdate.email} (Traccar ID: ${userToUpdate.traccarId}) password successfully updated in Traccar.`);
      } catch (traccarError) {
        console.error(`Failed to update user password in Traccar (internal log):`, traccarError);
        // Abort local DB update and return a generic error message to the client
        return {
          success: false,
          error: "An issue occurred during account activation. Please try again or contact support.",
        };
      }
    } else {
      console.warn(`User ${userToUpdate.email} has no Traccar ID. Skipping Traccar password update.`);
      // Decide if you want to allow local DB update without Traccar ID, or block it.
      // For now, we'll proceed if there's no Traccar ID but log a warning.
    }

    // 5. Update the user's password and invalidate activation token in your Prisma DB
    // This step will only be reached if the Traccar update (if applicable) succeeded,
    // or if the user had no Traccar ID.
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        accountActivationToken: null,
        activationTokenExpiry: null,
      },
    });

    if (!updatedUser) {
      return {
        success: false,
        error: "Failed to finalize account activation in local database.",
      };
    }

    return {
      success: true,
      error: null,
    };

  } catch (error) {
    console.error("Error setting user password:", error);
    // Catch-all for any other unexpected errors
    return {
      success: false,
      error: "An unexpected error occurred during account activation. Please try again.",
    };
  }
}

export async function isAdmin(userId: number): Promise<boolean> {
  if (!userId) {
    return false; // Invalid user ID provided
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true, // Only select the role field for efficiency
      },
    });

    // Check if user exists and their role is 'admin'
    return user?.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    // In a production environment, you might want to throw or return a more specific error
    return false; // Assume not an admin if there's an error
  }
}