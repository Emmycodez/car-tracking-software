"use server";

import { z } from "zod";
import { db } from "@/prisma/db";
import { callTraccarAdminApi, createTraccarUser } from "@/config/callTraccarAdminApi";
import { sendActivationEmail } from "@/lib/emailservice";
import { randomUUID } from "crypto";
import { ClientCreationProps } from "@/types/types";
import { Prisma } from "@prisma/client";



const DeleteUserIdSchema = z.number().int().min(1, "User ID must be a positive integer.");

export async function deleteUser(userId: number) {
  // 1. Input Validation
  const validatedId = DeleteUserIdSchema.safeParse(userId);

  if (!validatedId.success) {
    return {
      error: validatedId.error.message,
      status: 400,
    };
  }

  try {
    // 2. Find the user in the local database
    const userToDelete = await db.user.findUnique({
      where: { id: validatedId.data },
    });

    if (!userToDelete) {
      return {
        error: "User not found in local database.",
        status: 404,
      };
    }

    // 3. Delete user from Traccar (if a traccarId exists)
    if (userToDelete.traccarId) {
      await callTraccarAdminApi(`users/${userToDelete.traccarId}`, 'DELETE');
      console.log(`User ${userToDelete.email} (Traccar ID: ${userToDelete.traccarId}) deleted from Traccar.`);
    } else {
      console.log(`User ${userToDelete.email} has no Traccar ID. Skipping Traccar deletion.`);
    }

    // 4. Delete user from your local Prisma database
    await db.user.delete({
      where: { id: userToDelete.id },
    });

    console.log(`User ${userToDelete.email} deleted from local database.`);

    return {
      success: true,
      message: "User deleted successfully from both systems.",
      status: 200,
    };

  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      error: "An unexpected error occurred while deleting the user. Please try again.",
      status: 500,
    };
  }
}

const Client= z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Invalid email format."),
  businessName: z.string().min(1, "Business name is required."),
});
 


export const createClientAccount = async (data: ClientCreationProps) => {
try {
  const parsedData = Client.parse(data);

  const {email, name, businessName} = parsedData;
  if (!email || !name || !businessName) {
    return {
      error: "All fields are required",
      status: 400,
      data: null,
    };
  }
 // 1. Check if a user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: "A user with this email already exists.",
        status: 409,
        data: null,
      };
    }

    const accountActivationToken = randomUUID();
    const activationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // 3. Create the user in your Prisma database
    // Password and TraccarId are left as null because they haven't been set yet
    const createdUser = await db.user.create({
      data: {
        email,
        name,
       businessName, // Ensure you add this field to your schema
        accountActivationToken,
        activationTokenExpiry,
        password: null,
        traccarId: null,
      },
    });

     // 4. Create a corresponding user in Traccar with a temporary password
    const temporaryTraccarPassword = randomUUID(); // Use a strong, random password for Traccar
    const traccarUser = await createTraccarUser({
      name: createdUser.name || "Client User",
      email: createdUser.email,
      password: temporaryTraccarPassword,
      // The `administrator` flag should be false for regular clients
      administrator: false,
      readonly: false,
    });

    // 5. Update the local user with the Traccar ID
    const userWithTraccarId = await db.user.update({ 
      where: { id: createdUser.id },
      data: {
        traccarId: String(traccarUser.id),
      },
    });

     // 6. Generate the activation link
    const activationLink = `${process.env.APP_BASE_URL}/activate?token=${accountActivationToken}`;

     
    await sendActivationEmail(userWithTraccarId.email, activationLink);
    
    return {
      error: null,
      status: 201,
      id: userWithTraccarId.id,
      traccarId: userWithTraccarId.traccarId,
      data: {
        message: "Client account created successfully. Please check your email to activate your account.",
        activationLink
      },
      
    };

} catch (error) {
  console.error("Error creating client account:", error);
  if (error instanceof z.ZodError) {
    return {
      error: "Invalid input data",
      status: 400,
      data: null,
    };
  }

  return {
    error: "An unexpected error occurred. Please try again",
    status: 500,
    data: null,
  }
}
}




// Define a type for custom attributes (simple string keys and string values for now)
type CustomDeviceAttributes = {
  licensePlate?: string;
  make?: string;
  model?: string;
  year?: string;
  color?: string;
  // Add more as needed
  [key: string]: string | undefined; // Allow for other arbitrary string attributes
};




// Updated Schema for creating a device, now including attributes
const CreateDeviceSchema = z.object({
  name: z.string().min(1, "Device name is required."),
  uniqueId: z.string().min(1, "Unique ID (IMEI) is required."),
  userId: z.number().int().optional(), // This is the local Prisma User ID
  // New: Optional attributes for the device (vehicle data)
  attributes: z.object({
    licensePlate: z.string().optional(),
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.string().optional(),
    color: z.string().optional(),
    // Add other specific attributes you want to validate here
  }).optional(),
});

type CreateDeviceProps = z.infer<typeof CreateDeviceSchema>;

export async function createDevice(data: CreateDeviceProps) {
  try {
    const parsedData = CreateDeviceSchema.parse(data);
    const { name, uniqueId, userId, attributes } = parsedData; // Destructure attributes

    // 1. Check if a device with this uniqueId already exists locally
    const existingLocalDevice = await db.device.findUnique({
      where: { uniqueId },
    });

    if (existingLocalDevice) {
      return {
        error: "A device with this Unique ID already exists in your system.",
        status: 409,
        data: null,
      };
    }

    // Determine the Traccar user ID if a local userId is provided
    let traccarUserId: string | undefined = undefined;
    if (userId !== undefined && userId !== null) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { traccarId: true },
      });
      if (user?.traccarId) {
        traccarUserId = String(user.traccarId);
      } else {
        console.warn(`Local user ID ${userId} found but has no associated Traccar ID. Device will be created unassigned in Traccar.`);
      }
    }

    // 2. Create the device in Traccar
    // The 'userId' property is NOT sent directly in the POST /devices payload.
    // The association is made via the /permissions endpoint.
    const traccarDevice = await callTraccarAdminApi(
      'devices', // Endpoint for creating devices in Traccar
      'POST',     // HTTP method for creation
      {
        name,
        uniqueId,
        status: "offline", // Default status for new devices in Traccar
        disabled: false,     // Default disabled status
        attributes: attributes || {}, // Include the custom attributes for the vehicle
      }
    );

    if (!traccarDevice?.id) {
        throw new Error("Traccar did not return a valid device ID after creation.");
    }

    // 3. Link the device to the user in Traccar via permissions if a userId was provided
    if (traccarUserId) {
        try {
            await callTraccarAdminApi(
                'permissions',
                'POST',
                {
                  userId: parseInt(traccarUserId),
                    deviceId: traccarDevice.id, // )
                }
            );
            console.log(`Permission created for Traccar device ${traccarDevice.id} to Traccar user ${traccarUserId}.`);
        } catch (permissionError) {
            console.error(`Failed to create permission for Traccar device ${traccarDevice.id} and user ${traccarUserId}:`, permissionError);
            // Decide how to handle this. For now, we'll log and still create locally,
            // but the user might not see it in Traccar UI. A more strict approach
            // would involve deleting the device from Traccar if permission fails.
        }
    }


    // 4. Create the device record in your local Prisma database
    const createdLocalDevice = await db.device.create({
      data: {
        name,
        uniqueId,
        traccarId: String(traccarDevice.id), // Store Traccar's internal Device ID
        userId: userId, // Link to your local Prisma User ID
        attributes: (attributes || {}) as Prisma.InputJsonValue, // Store the attributes locally as JSON
      },
    });

    return {
      error: null,
      status: 201,
      data: {
        message: "Device created and linked successfully!",
        device: createdLocalDevice,
      },
    };

  } catch (error) {
    console.error("Error creating device:", error);
    if (error instanceof z.ZodError) {
      const formattedErrors = error.message;
      return {
        error: `Invalid input data: ${formattedErrors}`,
        status: 400,
        data: null,
      };
    }
    return {
      error: "An unexpected error occurred while creating the device. Please try again.",
      status: 500,
      data: null,
    };
  }
}






export async function deleteDevice(deviceId: number) {
  try {
    // 1. Fetch the local device to get its Traccar ID
    const localDevice = await db.device.findUnique({
      where: { id: deviceId },
      select: { id: true, traccarId: true, name: true },
    });

    if (!localDevice) {
      return {
        success: false,
        error: "Device not found in local database.",
        status: 404,
      };
    }

    // 2. Delete the device from Traccar
    // Traccar API endpoint for deleting a device is DELETE /api/devices/{id}
    if (localDevice.traccarId) {
      try {
        await callTraccarAdminApi(
          `devices/${localDevice.traccarId}`, // Endpoint for specific device
          'DELETE' // HTTP method for deletion
        );
        console.log(`Device ${localDevice.name} (Traccar ID: ${localDevice.traccarId}) successfully deleted from Traccar.`);
      } catch (traccarError) {
        console.error(`Failed to delete device ${localDevice.name} from Traccar (internal log):`, traccarError);
        // Abort local DB deletion and return a generic error message
        return {
          success: false,
          error: "An issue occurred during device deletion from Traccar. Please try again.",
          status: 500,
        };
      }
    } else {
      console.warn(`Device ${localDevice.name} has no Traccar ID. Skipping Traccar deletion.`);
    }

    // 3. Delete the device record from your local Prisma database
    await db.device.delete({
      where: { id: deviceId },
    });

    return {
      success: true,
      error: null,
      status: 200,
      message: "Device deleted successfully!",
    };

  } catch (error) {
    console.error("Error deleting device:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting the device. Please try again.",
      status: 500,
    };
  }
}

