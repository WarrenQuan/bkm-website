const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Anthropic } = require("@anthropic-ai/sdk");
const axios = require("axios");
import {promptMetadata, promptSentiment, promptTag} from "./prompts"

const MAX_TOKENS = 250;


require("dotenv").config();

// https://docs.anthropic.com/en/docs/build-with-claude/vision#before-you-upload
/**
 * Fetches a detailed description from the Anthropic API using the provided image URL.
 *
 * @param {string} apiKey - The API key for accessing the Anthropic API.
 * @param {string} image - The base64 string of image. Null if using image url.
 * @param {string} imageUrl - The URL of the image to be described.
 * @param {string} modelVersion - The model version to be used for generating the description.
 * @param {string} prompt - Prompt selection 
 * @returns {Promise<string>} - The generated description text.
 * @throws {Error} - Throws an error if the API call fails.
 */
async function getClaudeDescriptionFromImage(
  apiKey,
  image,
  imageUrl,
  modelVersion,
  prompt
) {
  console.log(prompt);
  try {
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });
    let finalImage;
    if (imageUrl) finalImage = await downloadImage(imageUrl);
    else {
      finalImage = getFileTypeAndData(image);
    }
    console.log({ finalImage });
    const msg = await anthropic.messages.create({
      model: modelVersion,
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
      system: getPrompt(prompt),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: finalImage.fileType,
                data: finalImage.base64Data,
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
 * @param {object: {image: base64, prompt: string}} image - The base64 string of image. Null if using image url.
 * @param {string} imageUrl - The URL of the image to be described. Null if using image file upload
 * @param {string} modelVersion - The model version to be used for generating the description.
 * @param {string} prompt - Prompt selection 
 * @returns {Promise<void>} - Logs the generated description text.
 */
async function getGoogleGeminiDescriptionFromImage(
  apiKey,
  image,
  imageUrl,
  modelVersion,
  prompt
) {
  console.log(prompt);
  if ((!imageUrl && !image) || !apiKey) return;
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelVersion });

  try {
    let finalImage;
    let imageData;

    if (imageUrl) {
      imageData = await downloadImage(imageUrl);
      finalImage = {
        inlineData: {
          data: imageData.base64Data,
          mimeType: imageData.fileType,
        },
      };
    } else {
      imageData = getFileTypeAndData(image);
      finalImage = {
        inlineData: {
          data: imageData.base64Data,
          mimeType: imageData.fileType,
        },
      };
    }
    console.log(finalImage);
    const result = await model.generateContent([getPrompt(prompt), finalImage]);

    const content = result.response.text();
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
 * @param {object {image: base64, prompt: string}} image - The base64 string of image. Null if using image url.
 * @param {string} modelVersion - The model version to be used for generating the description.
 * @returns {Promise<string>} - The generated description text.
 * @throws {Error} - Logs and throws an error if the API call fails.
 */
async function getOpenAIDescriptionFromImage(
  apiKey,
  image,
  imageUrl,
  modelVersion,
  prompt
) {
  console.log(prompt);
  if ((!imageUrl && !image) || !apiKey) {
    console.error(
      "Missing required parameters: imageUrl or image, and apiKey."
    );
    return;
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });
  // console.log("imageUrl")
  // console.log(imageUrl)
  let imageData;
  if (imageUrl) imageData = imageUrl;
  else imageData = image;

  // console.log(imageData)

  try {
    const response = await openai.chat.completions.create({
      model: modelVersion,
      messages: [
        {
          role: "system",
          content: getPrompt(prompt),
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageData,
              },
            },
          ],
        },
      ],
      max_tokens: MAX_TOKENS, // Adjust this as needed
    });

    if (response && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      console.log("Generated description:", content);
      return parseAltTextAndLongDescription(content);
    } else {
      console.error("No description generated by OpenAI.");
    }
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
  try {
    const [altText, longDescription] = content.split("LONG DESCRIPTION");
    return content;
  } catch (error) {
    return content;
  }
}

function getFileTypeAndData(dataUrl) {
  // Use a regular expression to capture the file type and the base64 data
  const matches = dataUrl.match(/^data:image\/([^;]+);base64,(.+)$/);
  if (matches) {
    const fileType = "image/" + matches[1];
    const base64Data = matches[2];
    return { fileType, base64Data };
  }
  return null;
}

function getPrompt(prompt) {
  switch (prompt) {
    case "metadata":
      return promptMetadata;
    case "sentiment analysis":
      return promptSentiment;
    case "tags":
      return promptTag;
    default:
      return promptMetadata;
  }
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
  const fileType = response.headers.get("Content-Type");
  const base64Data = Buffer.from(response.data).toString("base64");
  // console.log("got image");
  return { fileType, base64Data };
}

module.exports = {
  getOpenAIDescriptionFromImage,
  getGoogleGeminiDescriptionFromImage,
  getClaudeDescriptionFromImage,
};
