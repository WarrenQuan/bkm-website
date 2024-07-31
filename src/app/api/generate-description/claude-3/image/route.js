import { getClaudeDescriptionFromImage } from  "../../../generate_metadata";
import { headers } from 'next/headers'

export async function POST(request) {
  // const res = await request.json()
  // return Response.json({ res })
  
  const res = await request.json()
  const headersList = headers()
  const apiKey = headersList.get('x-api-key')
  const image  = res;
  console.log("havings res")
  // console.log(res)
  // console.log(apiKey)

    if (!image) {
      
      return Response.json({ error: 'Image is required' });
    }

    if (!apiKey) {
      return Response.json({ error: 'API key is required' });
    }

    try {
      console.log("ASDFADS")
      const description = await getClaudeDescriptionFromImage(apiKey, image, null, 'claude-3-5-sonnet-20240620');
      return Response.json(description);
    } catch (error) {
      return Response.json({ error: 'Error generating description' });
    }
}
