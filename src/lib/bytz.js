const BYTZ_API_URL = process.env.EXPO_PUBLIC_BYTZ_API_URL;
const BYTZ_API_KEY = process.env.EXPO_PUBLIC_BYTZ_API_KEY;
const BYTZ_MODEL = process.env.EXPO_PUBLIC_BYTZ_MODEL || 'text-image-image';

export async function generateVibeImage({ prompt, imageBase64 }) {
  const response = await fetch(BYTZ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${BYTZ_API_KEY}`
    },
    body: JSON.stringify({
      model: BYTZ_MODEL,
      prompt,
      image: imageBase64
    })
  });

  if (!response.ok) {
    throw new Error(`Bytz request failed: ${response.status}`);
  }

  const json = await response.json();
  return json.image_url;
}
