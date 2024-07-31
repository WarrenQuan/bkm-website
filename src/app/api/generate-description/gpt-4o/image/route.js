import { getOpenAIDescriptionFromImage } from  "../../../generate_metadata";
import { headers } from 'next/headers'

export async function POST(request) {
  // const res = await request.json()
  // return Response.json({ res })
  console.log("ASDFDS")
  const res = await request.json()
  const headersList = headers()
  const apiKey = headersList.get('x-api-key')
  const image  = res;
  console.log("havings res")
  console.log(res)
  console.log(res.imageUrl)
  console.log(apiKey)

    if (!image) {
      return Response.json({ error: 'Image is required' });
    }

    if (!apiKey) {
      return Response.json({ error: 'API key is required' });
    }

    try {

      const description = await getOpenAIDescriptionFromImage(apiKey, image, null, 'gpt-4o');
      return Response.json(description);
    } catch (error) {
      return Response.json({ error: 'Error generating description' });
    }
}
