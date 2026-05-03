import { GoogleGenAI, Type } from "@google/genai";
import { PrescriptionInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const PRESCRIPTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    medicineName: { type: Type.STRING },
    dosage: { type: Type.STRING },
    timing: {
      type: Type.OBJECT,
      properties: {
        morning: { type: Type.BOOLEAN },
        afternoon: { type: Type.BOOLEAN },
        night: { type: Type.BOOLEAN },
      },
      required: ["morning", "afternoon", "night"],
    },
    instructions: { type: Type.STRING, description: "The original instructions found in text." },
    simplifiedInstructions: { type: Type.STRING, description: "A simple, elderly-friendly version of the instructions." },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
    ageWarnings: { type: Type.STRING },
    genderWarnings: { type: Type.STRING },
  },
  required: ["medicineName", "dosage", "timing", "simplifiedInstructions"],
};

export async function simplifyPrescription(input: string | { data: string, mimeType: string }): Promise<PrescriptionInfo | null> {
  try {
    const prompt = `Extract medical information from this prescription ${typeof input === 'string' ? 'text' : 'image'}. 
    Convert abbreviations like 'BD', 'TID', 'OD', 'PC', 'AC' into simple language for an elderly person.
    Example: 'Tab Paracetamol 500mg BD after meals' -> 'Take 1 tablet (500mg) twice a day after food.'
    Identify timings (morning, afternoon, night) and any safety warnings.`;

    const contents = typeof input === 'string' 
      ? { parts: [{ text: input }, { text: prompt }] }
      : { parts: [{ inlineData: input }, { text: prompt }] };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: PRESCRIPTION_SCHEMA as any,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as PrescriptionInfo;
    }
  } catch (error) {
    console.error("Gemini Error:", error);
  }
  return null;
}
