import { getGoogleGeminiDescriptionFromImage } from  "../../../generate_metadata";
import { headers } from 'next/headers'

export async function POST(request) {
  // const res = await request.json()
  // return Response.json({ res })
  const res = await request.json()
  const headersList = headers()
  const apiKey = headersList.get('x-api-key')
  const image  = res;

    if (!image) {
      return Response.json({ error: 'Image is required' });
    }

    if (!apiKey) {
      return Response.json({ error: 'API key is required' });
    }

    try {
      const description = await getGoogleGeminiDescriptionFromImage(apiKey, image, null, 'gemini-1.5-flash');
      return Response.json(description);
    } catch (error) {
      return Response.json({ error: 'Error generating description' });
    }
}
