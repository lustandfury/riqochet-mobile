import { GoogleGenAI } from "@google/genai";
import { GeneratePosterParams } from "../types";

// Helper to determine if we can actually use the API
const hasApiKey = !!process.env.GEMINI_API_KEY;

// Debug logging
console.log('🔑 Environment Check:', {
  hasApiKey,
  apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
  apiKeyPrefix: process.env.GEMINI_API_KEY?.substring(0, 10) + '...'
});

export const generatePoster = async (params: GeneratePosterParams): Promise<string> => {
  if (!hasApiKey) {
    console.warn("No API Key found. Returning mock image.");
    return mockImageGeneration(params.sport);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Construct a vivid prompt for the poster
    let prompt = `
      Create a high-energy, vertical graphical poster for a ${params.sport} tournament named "${params.name}".
      Setting: ${params.location}.
      Mood: ${params.mood}.
      Visual style: Modern digital art, vibrant colors, cinematic lighting.
      Action: Dynamic composition with athletic figures in motion.
      ${params.playerCount > 0 ? `Include ${params.playerCount + 1} distinct character silhouettes or figures in the foreground representing the players joined.` : 'Feature a central heroic figure silhouette.'}
      Aspect Ratio: 9:16.
      Text: Do not include text on the poster, just the art.
    `;

    // Add profile pictures to the prompt if provided
    if (params.profilePictures && params.profilePictures.length > 0) {
      prompt += `
      
      IMPORTANT: Incorporate the following ${params.profilePictures.length} profile picture(s) into the poster design:
      ${params.profilePictures.map((pic, index) => `[PROFILE_PICTURE_${index + 1}: ${pic.substring(0, 50)}...]`).join('\n      ')}
      
      Use these profile pictures to create custom faces for the main characters in the poster. 
      Blend the facial features and expressions naturally into the athletic figures.
      Make the faces recognizable but stylized to match the ${params.mood} aesthetic.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // While the documentation says "imageConfig" for some models,
        // gemini-2.5-flash-image often infers image generation from prompt or specific tool usage.
        // We will try the standard generateContent which returns an image part for this specific model family
        // as per the provided "Generate Images" guidance for nano banana.
      }
    });

    // Iterate to find image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Gemini Image Generation failed:", error);
    // Fallback to mock if API fails (graceful degradation)
    return mockImageGeneration(params.sport);
  }
};

const mockImageGeneration = (sport: string): string => {
  // Return a placeholder from picsum based on a hash of the sport to be consistent
  const seed = sport.length; 
  return `https://picsum.photos/seed/${seed}/800/1200`;
};
