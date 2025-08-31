import { GoogleGenAI, Type } from "@google/genai";
import type { QuoteDetails } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quoteDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    quote: {
      type: Type.STRING,
      description: "The generated quote. It must be a real quote, not made up.",
    },
    source: {
      type: Type.STRING,
      description:
        "The person or character who said the quote. If unknown, use 'Anonymous'.",
    },
    imagePrompt: {
      type: Type.STRING,
      description:
        "A detailed, visually rich prompt for an image generation model to create a background that fits the theme and mood of the quote. Describe colors, style, and subject matter.",
    },
    fontSuggestion: {
      type: Type.STRING,
      description:
        "A one or two-word suggestion for the font style that matches the quote's mood (e.g., 'Elegant Serif', 'Modern Sans-serif', 'Handwritten Script', 'Retro 8-bit', 'Futuristic Sci-Fi').",
    },
  },
  required: ["quote", "source", "imagePrompt", "fontSuggestion"],
};

export async function generateQuoteDetails(
  userPrompt: string
): Promise<QuoteDetails> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user wants a quote image based on this prompt: "${userPrompt}". Your task is to generate the components for this image. Find a real, verifiable quote that fits the user's request. Also, provide the source of the quote. Then, create a detailed prompt for an image generation model to create a background that matches the quote's theme. Finally, suggest a font style. The quote must not be made up.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quoteDetailsSchema,
      },
    });

    const jsonText = response.text.trim();
    const quoteDetails = JSON.parse(jsonText);
    return quoteDetails;
  } catch (error) {
    console.error("Error generating quote details:", error);
    throw new Error(
      "Failed to generate quote details from AI. The model may have returned an invalid format."
    );
  }
}

const MODEL_ID = "black-forest-labs/FLUX.1-dev";

export async function generateQuoteImage(prompt: string): Promise<string> {
  const token = import.meta.env.VITE_HF_API_TOKEN;
  if (!token) throw new Error("VITE_HF_API_TOKEN is missing");

  const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // Disable caching while testing; optional
      "x-use-cache": "false",
    },
    body: JSON.stringify({ inputs: prompt }),
  });

  // HF sometimes returns 202 while spinning up the model; quick retry:
  if (res.status === 202) {
    await new Promise(r => setTimeout(r, 3000));
    return generateQuoteImage(prompt);
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HF error ${res.status}: ${msg}`);
  }

  const blob = await res.blob();               // <-- IMAGE BYTES
  const url = URL.createObjectURL(blob);       // <-- BLOB URL
  return url;                                  // e.g. "blob:http://localhost:5173/...."
}
