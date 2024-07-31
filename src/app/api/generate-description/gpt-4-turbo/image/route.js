import { getOpenAIDescriptionFromImage } from  "../../../generate_metadata";
import { headers } from 'next/headers'

export async function POST(request) {
  // const res = await request.json()
  // return Response.json({ res })
  console.log(request)
  const res = await request.json()
  console.log(res)
  const headersList = headers()
  const apiKey = headersList.get('x-api-key')
  console.log(apiKey)

    if (!imageUrl) {
      return Response.json({ error: 'Image URL is required' });
    }

    if (!apiKey) {
      return Response.json({ error: 'API key is required' });
    }

    try {
      const description = await getOpenAIDescriptionFromImage(apiKey, null, imageUrl, 'gpt-4-turbo');
      return Response.json(description);
    } catch (error) {
      return Response.json({ error: 'Error generating description' });
    }
}
