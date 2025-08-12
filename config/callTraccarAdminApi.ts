"use server"

export async function callTraccarAdminApi(endpoint: string, method: string, body?: any) {
  const TRACCAR_URL = process.env.TRACCAR_API_URL;
  const TRACCAR_ADMIN_TOKEN = process.env.TRACCAR_ADMIN_TOKEN;

  if (!TRACCAR_ADMIN_TOKEN) {
    throw new Error("Traccar admin token not set.");
  }

  const response = await fetch(`${TRACCAR_URL}/api/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TRACCAR_ADMIN_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Traccar API Error for ${endpoint}: ${errorText}`);
    throw new Error(`Failed to call Traccar API: ${response.statusText}`);
  }

  return response.json();
}