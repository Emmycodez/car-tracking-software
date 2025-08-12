"use server"

async function generateTraccarAdminToken() {
  const TRACCAR_URL = process.env.TRACCAR_API_URL;
  const ADMIN_EMAIL = process.env.TRACCAR_ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.TRACCAR_ADMIN_PASSWORD;

  // 1. Combine email and password into a single string
  const credentials = `${ADMIN_EMAIL}:${ADMIN_PASSWORD}`;
  
  // 2. Encode the string in Base64
  const encodedCredentials = btoa(credentials);

  try {
    const response = await fetch(`${TRACCAR_URL}/api/session/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to generate Traccar admin token:', errorText);
      throw new Error('Traccar API request failed');
    }

    // The response body is the token itself
    const token = await response.text();
    console.log('Successfully generated Traccar admin token:');
    console.log(token);
    
    // Return the token to be used in your application
    return token;
  } catch (error) {
    console.error('An error occurred during token generation:', error);
    return null;
  }
}