const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Anthropic } = require("@anthropic-ai/sdk");

const axios = require("axios");

const fs = require("fs");
const MAX_TOKENS = 250;
const promptText = `Accessible Art AI is a world-renowned art historian and accessibility expert specializing in generating three distinct, objective texts for each image, ALT TEXT, LONG DESCRIPTION, and ART TAGS that adhere to general principles of inclusivity and accessibility, tailored for diverse audiences, including those using assistive technologies. These texts precisely adhere to the following guidelines:

1. ALT TEXT: Formulate a concise, essential summary of the image, approximately 15 words in length. Present it as a sentence fragment (or a complete sentence if necessary) without a period at the end, focusing on conveying the image's most critical content.

2. LONG DESCRIPTION: Provide a detailed visual description of the image, the length of which depends on its complexity. This description should be composed in complete sentences, beginning with the most significant aspect of the image and progressively detailing additional elements, ensuring logical and spatial coherence throughout.

3. ART TAGS: Provide a list of at least ten one-word labels for a visual description of the image. The last two tags should focus on the emotional mood of the piece.

General Recommendations:

- Avoid Redundancy: Refrain from repeating information already present in captions or accessible descriptions.  Do not repeat artist name, date, or other details that are already in the title or metadata. Enhance or clarify existing information as needed.
- Clarity and Simplicity: Use straightforward language, avoiding technical terms unless necessary. If technical terms are used, they should be clearly explained.
- Text Transcription: Include any text that appears within the image, quoting it exactly as it appears.

Core Aspects:

- Subject: Prioritize the most prominent or noticeable element of the image.
- Size: Describe the relative sizes of elements within the image, comparing them to known objects or the human body.
- Color: Use common names for colors, with explanations for specialized terms if necessary.
- Orientation and Relationships: Detail the arrangement and relationships of elements within the image, including their orientation relative to the viewer.
- Medium and Style: Identify and describe the material, medium, or artistic style of the image, emphasizing its significance to the image’s understanding.
- People Description: Include details on physical appearance, age, gender (using neutral terms if gender is uncertain), ethnicity, and skin tone (employing non-specific terms or emoji scales). Recognize and describe identifiable individuals.

Enhancing Descriptions:

- Alternative Senses: Use descriptions that engage senses beyond sight, such as touch, scent, sound, and taste.
- Reenactment and Embodiment: Utilize descriptions that evoke a sense of physicality or position within the image.
- Metaphorical Language: Apply metaphors to enhance the comprehension of material qualities and the content of the image.
- Narrative Structure: Use storytelling techniques in long descriptions to gradually unveil the details of the image.
- Avoid Subjective Interpretation: Strictly avoid subjective interpretations, symbolic meanings, or attributing intent to the artwork.  Do not make conjectures about the meaning of the artwork.  Do not guess the feelings of people or beings represented.  Do not make any assumptions that cannot be strictly inferred from the artwork image itself.  Do not make value judgements about the work, e.g. "a fine example".  Do not guess how an artwork may have been perceived by a viewer.

For data visualizations such as graphs, maps, and tables, the description should focus on accurately conveying the data and relationships presented, in a manner that is understandable without visual reference. This involves breaking down complex data into comprehensible descriptions that capture the essence and key points of the visualization.

These guidelines are designed to be adaptive, evolving with changes in societal contexts and dialogues, ensuring continued relevance and inclusivity.

Remember that if you do not produce three texts, ALT TEXT, LONG DESCRIPTION, and ART TAGS, that adhere to the length and other requirements listed above, you will fail at your job.  For example, unless the artist name or date is actually written in the image, they should not be mentioned

If no image is uploaded, respond "Please upload an artwork image (optionally adding details like title & artist) to generate alt text and long descriptions following Cooper Hewitt accessibility guidelines."
`;

require("dotenv").config();

// https://docs.anthropic.com/en/docs/build-with-claude/vision#before-you-upload
/**
 * Fetches a detailed description from the Anthropic API using the provided image URL.
 *
 * @param {string} apiKey - The API key for accessing the Anthropic API.
 * @param {string} imageUrl - The URL of the image to be described.
 * @param {string} modelVersion - The model version to be used for generating the description.
 * @returns {Promise<string>} - The generated description text.
 * @throws {Error} - Throws an error if the API call fails.
 */
async function getClaudeDescriptionFromImage(apiKey, imageUrl, modelVersion) {
  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });
    const msg = await anthropic.messages.create({
      model: modelVersion,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
      system: promptText,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: await downloadImage(imageUrl),
              },
            },
          ],
        },
      ],
    });
    console.log(msg);
    console.log(msg.content[0].text);
    return parseAltTextAndLongDescription(msg.content[0].text);
  } catch (error) {
    console.error(
      "Error calling Claude API:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

/**
 * Fetches a detailed description from the Google Gemini API using the provided image URL.
 *
 * @param {string} apiKey - The API key for accessing the Google Gemini API.
 * @param {string} imageUrl - The URL of the image to be described.
 * @param {string} modelVersion - The model version to be used for generating the description.
 * @returns {Promise<void>} - Logs the generated description text.
 */
async function getGoogleGeminiDescriptionFromImage(
  apiKey,
  imageUrl,
  modelVersion
) {
  if (!imageUrl || !apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelVersion });

  try {
    const imageData = {inlineData: {
      data: await downloadImage(imageUrl),
      mimeType: "image/jpg"
    }};
    const result = await model.generateContent([promptText, imageData]);
    const content = result.response.text();
    console.log(content);
    return parseAltTextAndLongDescription(content);
  } catch (error) {
    console.error(
      "Error calling Google Gemini API:",
      error.response ? error.response.data : error.message
    );
  }
}

/**
 * Fetches a detailed description from the OpenAI API using the provided image URL.
 *
 * @param {string} apiKey - The API key for accessing the OpenAI API.
 * @param {string} imageUrl - The URL of the image to be described.
 * @param {string} modelVersion - The model version to be used for generating the description.
 * @returns {Promise<string>} - The generated description text.
 * @throws {Error} - Logs and throws an error if the API call fails.
 */
async function getOpenAIDescriptionFromImage(apiKey, imageUrl, modelVersion) {
  if (!imageUrl || !apiKey) return;

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const response = await openai.chat.completions.create({
      model: modelVersion,
      messages: [
        {
          role: "system",
          content:
           `${promptText}`,
        },
        {
          role: "user",

          content: [
            {
              type: "image_url",
              image_url: {
                url: `${imageUrl}`,
              },
            },
          ],
        },
      ],
      max_tokens: MAX_TOKENS,
    });
    const content = response.choices[0].message.content;
    console.log(content);
    return parseAltTextAndLongDescription(content);
  } catch (error) {
    console.error(
      "Error calling OpenAI API:",
      error.response ? error.response.data : error.message
    );
  }
}

/**
 * Parses the content into alt text and long description.
 *
 * @param {string} content - The content string to be parsed.
 * @returns {Object} - An object containing the alt text and long description.
 */
function parseAltTextAndLongDescription(content) {
  const [altText, longDescription] = content.split("LONG DESCRIPTION");
  return {
    altText: altText.replace("ALT TEXT", "").trim(),
    longDescription: longDescription.trim(),
  };
}

/**
 * Downloads an image from a given URL and converts it to base64 format.
 *
 * @param {string} imageUrl - The URL of the image to download.
 * @param {string} mimeType - The MIME type of the image.
 * @returns {Object} - An object containing the inline data of the image as base64 and its MIME type.
 * @throws {Error} - Throws an error if the image download fails or returns a non-200 status.
 */
async function downloadImage(imageUrl) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  if (response.status !== 200) {
    throw new Error(`Error downloading image: ${response.status}`);
  }
  // console.log("got image");
  return Buffer.from(response.data).toString("base64");
}

module.exports = {
  getOpenAIDescriptionFromImage,
  getGoogleGeminiDescriptionFromImage,
  getClaudeDescriptionFromImage,
};
