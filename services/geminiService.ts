import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAssistantResponse = async (prompt: string, language: string) => {
  try {
    const ai = getAI();
    const systemInstruction = `
      You are a helpful assistant for "C-Korea Connect", a platform helping people find Chinese-friendly businesses in South Korea.
      Respond in the user's requested language: ${language}.
      Available categories: 餐饮 (Food), 娱乐 (Entertainment), 购物 (Shopping), 便民 (Services).
      Be polite, informative, and concise.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    return response.text || "Sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI assistant.";
  }
};

export const autoTranslateContent = async (text: string) => {
  try {
    const ai = getAI();
    const prompt = `Translate the following Korean text into Chinese (Simplified) and English: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional translator. Always return JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zh: { type: Type.STRING },
            en: { type: Type.STRING }
          },
          required: ["zh", "en"]
        }
      }
    });

    if (response.text) return JSON.parse(response.text.trim());
    throw new Error("No response");
  } catch (error) {
    return { zh: "Error", en: "Error" };
  }
};

export const ocrAndTranslate = async (base64Image: string) => {
  try {
    const ai = getAI();
    const prompt = "Please perform OCR on this image, extract any business-related text (like menu items or store names), and translate them into Chinese (Simplified) and English.";
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg"
      }
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        systemInstruction: "Extract text from image and provide translations in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalText: { type: Type.STRING },
            chineseText: { type: Type.STRING },
            englishText: { type: Type.STRING }
          },
          required: ["originalText", "chineseText", "englishText"]
        }
      }
    });

    if (response.text) return JSON.parse(response.text.trim());
    throw new Error("OCR Failed");
  } catch (error) {
    console.error("OCR Error:", error);
    return { originalText: "OCR Failed", chineseText: "", englishText: "" };
  }
};