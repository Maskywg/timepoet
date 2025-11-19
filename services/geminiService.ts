import { GoogleGenAI, Type } from "@google/genai";
import { InsightResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getTimeInsight = async (date: Date): Promise<InsightResponse> => {
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Current time is ${timeString} on ${dateString}. 
      Generate a short, poetic, or philosophical insight about this specific moment in time.
      The output MUST be in Traditional Chinese (繁體中文).
      Also provide a "mood" keyword that describes the feeling of this time in Traditional Chinese.
      Keep the insight under 20 words.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insight: {
              type: Type.STRING,
              description: "A poetic or philosophical sentence in Traditional Chinese.",
            },
            mood: {
              type: Type.STRING,
              description: "A single keyword describing the mood in Traditional Chinese.",
            }
          },
          required: ["insight", "mood"],
        },
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response text");
    
    // Robustly strip markdown code blocks if present to prevent JSON parsing errors
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(text) as InsightResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      insight: "時間如長河，川流不息，帶我們無盡向前。",
      mood: "永恆"
    };
  }
};