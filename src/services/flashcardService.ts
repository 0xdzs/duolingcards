import { supabase } from '../lib/supabase';
import { Deck, Card } from '../types';
import toast from 'react-hot-toast';

// Deck operations
export const createDeck = async (deck: Omit<Deck, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Deck | null> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('decks')
      .insert({
        ...deck,
        user_id: userData.user.id
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Failed to create deck');
    console.error('Error creating deck:', error);
    return null;
  }
};

export const getDecks = async (): Promise<Deck[]> => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select(`
        *,
        card_count:cards(count)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(deck => ({
      ...deck,
      card_count: typeof deck.card_count === 'object' && deck.card_count !== null
        ? deck.card_count.count
        : deck.card_count || 0
    }));
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch decks');
    console.error('Error fetching decks:', error);
    return [];
  }
};

export const getDeckById = async (id: string): Promise<Deck | null> => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select(`
        *,
        card_count:cards(count)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      ...data,
      card_count: typeof data.card_count === 'object' && data.card_count !== null
        ? data.card_count.count
        : data.card_count || 0
    };
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch deck');
    console.error('Error fetching deck:', error);
    return null;
  }
};

export const updateDeck = async (id: string, updates: Partial<Deck>): Promise<Deck | null> => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Failed to update deck');
    console.error('Error updating deck:', error);
    return null;
  }
};

export const deleteDeck = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete deck');
    console.error('Error deleting deck:', error);
    return false;
  }
};

// Card operations
export const createCard = async (card: Omit<Card, 'id' | 'created_at' | 'updated_at'>): Promise<Card | null> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .insert(card)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Failed to create card');
    console.error('Error creating card:', error);
    return null;
  }
};

export const createCards = async (cards: Omit<Card, 'id' | 'created_at' | 'updated_at'>[]): Promise<Card[] | null> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .insert(cards)
      .select();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Failed to create cards');
    console.error('Error creating cards:', error);
    return null;
  }
};

export const getCardsByDeckId = async (deckId: string): Promise<Card[]> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Failed to fetch cards');
    console.error('Error fetching cards:', error);
    return [];
  }
};

export const updateCard = async (id: string, updates: Partial<Card>): Promise<Card | null> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    toast.error(error.message || 'Failed to update card');
    console.error('Error updating card:', error);
    return null;
  }
};

export const deleteCard = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete card');
    console.error('Error deleting card:', error);
    return false;
  }
};
