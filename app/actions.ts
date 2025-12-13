'use server';

import { GoogleGenAI, Modality } from "@google/genai";
import { GeminiModel } from '../types';

// Initialize Gemini on the server side
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export async function generateSummary(title: string, author: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Provide a concise 3-sentence summary of the book "${title}" by ${author}. Focus on the main conflict and themes.`,
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Failed to generate summary.";
  }
}

export async function chatWithBook(title: string, author: string, question: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: GeminiModel.PRO,
      contents: `You are an expert librarian. Context: The book is "${title}" by ${author}. 
      User Question: ${question}
      Answer helpful and accurately based on the book's content. Keep it brief.`,
    });
    return response.text || "I couldn't find an answer to that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error communicating with AI.";
  }
}

export async function generateTTSPreview(text: string): Promise<string | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: GeminiModel.TTS,
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
}