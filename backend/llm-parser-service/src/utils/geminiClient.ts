import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function sendPromptToGemini({
  model,
  prompt,
  system,
  temperature = 0.1,
  responseSchema,
}: {
  model: string;
  prompt: string;
  system: string;
  temperature?: number;
  responseSchema?: any;
}): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,

      // Using the STRUCTURE  OUTPUT option to specify the response format as JSON and giving schema
      config: {
        systemInstruction: system,
        temperature: temperature,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    if (!response?.text) throw new Error("No response from Gemini");

    return response.text;
  } catch (error) {
    console.error("Error while sending prompt to Gemini:", error);
    throw error;
  }
}
