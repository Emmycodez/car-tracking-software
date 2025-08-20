"use server"

const TRACCAR_API_URL = process.env.TRACCAR_API_URL;
const TRACCAR_ADMIN_USERNAME = process.env.ADMIN_EMAIL
const TRACCAR_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

console.log("TRACCAR_API_URL:", TRACCAR_API_URL);
/**
 * Calls the Traccar API with administrator credentials.
 * @param endpoint The API endpoint (e.g., 'users', 'devices/123', 'permissions'). Do NOT include '/api/'.
 * @param method The HTTP method (GET, POST, PUT, DELETE).
 * @param body The request body for POST/PUT requests (optional).
 * @returns The JSON response from the Traccar API.
 * @throws An error if API URL or credentials are not set, or if the API call fails.
 */
export async function callTraccarAdminApi(
  endpoint: string,
  method: string = 'GET',
  body?: object
) {
  // Basic validation for environment variables
  if (!TRACCAR_API_URL) {
    throw new Error("TRACCAR_API_URL environment variable is not set.");
  }
  if (!TRACCAR_ADMIN_USERNAME || !TRACCAR_ADMIN_PASSWORD) {
    throw new Error("TRACCAR_ADMIN_USERNAME or TRACCAR_ADMIN_PASSWORD environment variables are not set. Basic authentication for Traccar API requires these.");
  }

  // Construct Basic Authentication header
  const authString = Buffer.from(`${TRACCAR_ADMIN_USERNAME}:${TRACCAR_ADMIN_PASSWORD}`).toString('base64');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json', // Specify accepted response type
    'Authorization': `Basic ${authString}`, // Use Basic Authentication
  };

  try {
    const response = await fetch(`${TRACCAR_API_URL}/api/${endpoint}`, {
      method,
      headers,
      // Only include body for POST/PUT requests
      body: (method === 'POST' || method === 'PUT') ? JSON.stringify(body) : undefined,
      // Prevents caching of API responses if not desired, especially for dynamic data
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Traccar API Error for ${endpoint} (${method} request): Status ${response.status} - ${response.statusText}`, errorText);
      throw new Error(`Failed to call Traccar API: ${response.statusText} - ${errorText}`);
    }

    // Only parse JSON if the response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      // For responses without JSON content (e.g., DELETE requests returning 204 No Content)
      return {};
    }

  } catch (error) {
    console.error(`Error during Traccar API call to ${endpoint} (${method} request):`, error);
    throw error; // Re-throw to be caught by the calling server action
  }
}


// New wrapper function that specifically creates a Traccar user
interface TraccarUserCreationProps {
  name: string;
  email: string;
  password: string;
  administrator?: boolean;
  readonly?: boolean;
}

export async function createTraccarUser(userData: TraccarUserCreationProps) {
  const endpoint = 'users';
  const method = 'POST';

  const body = {
    ...userData,
    administrator: userData.administrator ?? false, // Default to false if not provided
    readonly: userData.readonly ?? false, // Default to false if not provided
  };

  return callTraccarAdminApi(endpoint, method, body);
}