import { GoogleGenAI, Type } from "@google/genai";
import { InsightResponse } from "../types";

const OFFLINE_INSIGHTS: InsightResponse[] = [
  { insight: "在靜謐的時光縫隙中，思緒如塵埃般輕輕飄落。", mood: "靜謐" },
  { insight: "時間不語，卻在每一次秒針的跳動中，訴說著永恆。", mood: "永恆" },
  { insight: "此刻的停留，是為了更好地出發，去遇見未知的自己。", mood: "沉澱" },
  { insight: "星光穿越億萬光年而來，只為照亮這一瞬間的孤獨。", mood: "陪伴" },
  { insight: "即使沒有路標，心中的指南針依然指向希望的方向。", mood: "希望" },
  { insight: "聆聽風的聲音，它帶走了昨日的憂愁，帶來了明日的氣息。", mood: "釋懷" },
  { insight: "在數位的洪流中，找尋一處安放靈魂的棲息地。", mood: "歸屬" },
  { insight: "世界雖然喧囂，但內心的花園依然可以四季如春。", mood: "安寧" }
];

export const getTimeInsight = async (date: Date): Promise<InsightResponse> => {
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  try {
    let apiKey = "";
    
    // Safe environment variable access
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process?.env?.API_KEY) {
        // @ts-ignore
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      console.debug("Environment check failed");
    }

    // If no key is found, throw immediately to trigger fallback
    if (!apiKey) {
      throw new Error("No API Key found");
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // Create a timeout promise to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), 8000);
    });

    // API call configuration
    const apiPromise = ai.models.generateContent({
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
              description: "A poetic sentence in Traditional Chinese.",
            },
            mood: {
              type: Type.STRING,
              description: "A mood keyword in Traditional Chinese.",
            }
          },
          required: ["insight", "mood"],
        },
      },
    });

    // Race API against timeout
    // @ts-ignore
    const response = await Promise.race([apiPromise, timeoutPromise]);
    
    // @ts-ignore
    let text = response.text;
    if (!text) throw new Error("Empty response from AI");

    // Cleanup potential markdown code blocks just in case
    text = text.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    return JSON.parse(text) as InsightResponse;

  } catch (error) {
    console.warn("Service unavailable, switching to offline wisdom:", error);
    
    // Artificial delay to make it feel like it "thought" about it
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return random fallback ensuring the function always succeeds
    const randomInsight = OFFLINE_INSIGHTS[Math.floor(Math.random() * OFFLINE_INSIGHTS.length)];
    return randomInsight;
  }
};