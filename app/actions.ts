'use server';

import { GoogleGenAI, Modality } from "@google/genai";
import { GeminiModel } from '../types';
import { getCached, setCached } from '../lib/upstash';
import { logAnalyticsEvent } from '../lib/motherduck';
import { createClient } from '../utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Initialize Gemini on the server side
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export async function generateSummary(title: string, author: string): Promise<string> {
  const cacheKey = `summary:${title}:${author}`;
  
  // 1. Check Upstash Cache
  const cached = await getCached<string>(cacheKey);
  if (cached) {
    await logAnalyticsEvent('summary_view', { title, author, source: 'cache' });
    return cached;
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Provide a concise 3-sentence summary of the book "${title}" by ${author}. Focus on the main conflict and themes.`,
    });
    
    const text = response.text || "No summary available.";
    
    // 2. Save to Upstash Cache (24 hour TTL)
    await setCached(cacheKey, text, 86400);
    
    // 3. Log to MotherDuck
    await logAnalyticsEvent('summary_generated', { title, author, source: 'gemini' });

    return text;
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Failed to generate summary.";
  }
}

export async function chatWithBook(title: string, author: string, question: string): Promise<string> {
  try {
    await logAnalyticsEvent('chat_query', { title, author, question });

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
    
    if (base64Audio) {
        await logAnalyticsEvent('tts_generated', { length: text.length });
    }
    
    return base64Audio || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
}

export async function createBook(formData: any) {
  const supabase = await createClient();
  
  const { error } = await supabase.from('books').insert({
    title: formData.title,
    author: formData.author,
    description: formData.description,
    cover_url: formData.cover,
    series: formData.series,
    duration: formData.duration || 0,
    genres: formData.genres || [],
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error("Supabase Import Error:", error);
    throw new Error(error.message);
  }

  await logAnalyticsEvent('book_imported', { title: formData.title, author: formData.author });
  revalidatePath('/');
}