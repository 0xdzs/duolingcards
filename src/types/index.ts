export interface User {
  id: string;
  email: string;
}

export interface Deck {
  id: string;
  name: string;
  description: string;
  language: string;
  translation_language: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  card_count?: number;
}

export interface Card {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  created_at: string;
  updated_at: string;
  last_reviewed?: string;
  review_count?: number;
  difficulty?: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
}

export interface ProcessedCard {
  front: string;
  back: string;
}
