import { createWorker } from 'tesseract.js';
import { OCRResult, ProcessedCard } from '../types';
import toast from 'react-hot-toast';

export const performOCR = async (imageFile: File): Promise<OCRResult | null> => {
  try {
    const worker = await createWorker('eng');
    
    const result = await worker.recognize(imageFile);
    await worker.terminate();
    
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error('OCR error:', error);
    toast.error('Failed to process image');
    return null;
  }
};

export const processWithAI = async (ocrText: string, language: string, translationLanguage: string): Promise<ProcessedCard[] | null> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Google Gemini API key is missing');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = `
You are a language learning assistant that extracts vocabulary from Duolingo screenshots.
Extract word pairs from the OCR text and format them as flashcards.
The target language is ${language}.
The translation language is ${translationLanguage}.
Extract vocabulary pairs from this Duolingo screenshot OCR text and format them as flashcards.
Return ONLY a JSON array of objects with 'front' (word in ${language}) and 'back' (translation in ${translationLanguage}) properties.
OCR Text: ${ocrText}
`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Gemini API did not return JSON:', text);
      throw new Error('Gemini API did not return valid JSON. Raw response: ' + text);
    }

    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.error || text;
      console.error('Gemini API error:', errorMsg);
      throw new Error(`Gemini API error: ${errorMsg}`);
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) throw new Error('No response from Gemini API');

    // Try to extract JSON from code block or plain text
    let jsonContent = aiResponse;
    const codeBlockMatch = aiResponse.match(/```(?:json)?\n?([\s\S]*?)\n?```/i);
    if (codeBlockMatch && codeBlockMatch[1]) {
      jsonContent = codeBlockMatch[1];
    }

    // Check if jsonContent looks like JSON (starts with [ or {)
    const isLikelyJson = jsonContent.trim().startsWith('[') || jsonContent.trim().startsWith('{');

    let cards;
    if (isLikelyJson) {
      try {
        cards = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError, jsonContent);
        throw new Error('Failed to parse Gemini response. Raw response: ' + aiResponse);
      }
    } else {
      // Not JSON, so show the Gemini message as an error
      throw new Error('Gemini could not extract flashcards: ' + aiResponse);
    }

    if (Array.isArray(cards) && cards.length > 0) {
      return cards;
    } else {
      throw new Error('Invalid card format returned by Gemini. Raw response: ' + aiResponse);
    }
  } catch (error: any) {
    console.error('Gemini processing error:', error);
    toast.error(error.message || 'Failed to process with Gemini');
    return null;
  }
};
