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

export const processWithAI = async (ocrText: string, language: string): Promise<ProcessedCard[] | null> => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key is missing');
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'google/gemini-pro',
        messages: [
          {
            role: 'system',
            content: `You are a language learning assistant that extracts vocabulary from Duolingo screenshots. 
                     Extract word pairs from the OCR text and format them as flashcards.
                     The target language is ${language}.`
          },
          {
            role: 'user',
            content: `Extract vocabulary pairs from this Duolingo screenshot OCR text and format them as flashcards. 
                     Return ONLY a JSON array of objects with 'front' (word in ${language}) and 'back' (translation) properties.
                     OCR Text: ${ocrText}`
          }
        ],
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to process with AI');
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || 
                      aiResponse.match(/```\n([\s\S]*?)\n```/) ||
                      [null, aiResponse];
    
    const jsonContent = jsonMatch[1] || aiResponse;
    
    try {
      const cards = JSON.parse(jsonContent);
      if (Array.isArray(cards) && cards.length > 0) {
        return cards;
      } else {
        throw new Error('Invalid card format returned');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Failed to parse AI response');
    }
  } catch (error: any) {
    console.error('AI processing error:', error);
    toast.error(error.message || 'Failed to process with AI');
    return null;
  }
};
