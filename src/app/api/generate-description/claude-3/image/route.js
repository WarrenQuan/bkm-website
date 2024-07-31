import { getClaudeDescriptionFromImage } from  "../../../generate_metadata";
import { headers } from 'next/headers'

export async function POST(request) {
  // const res = await request.json()
  // return Response.json({ res })
  
  const res = await request.json()
  const headersList = headers()
  const apiKey = headersList.get('x-api-key')

    if (!res.base64) {
      
      return Response.json({ error: 'Image is required' });
    }

    if (!apiKey) {
      return Response.json({ error: 'API key is required' });
    }

    try {
      const description = await getClaudeDescriptionFromImage(apiKey, res.base64, null, 'claude-3-5-sonnet-20240620', res.prompt);
      return Response.json(description);
    } catch (error) {
      return Response.json({ error: 'Error generating description' });
    }
}
