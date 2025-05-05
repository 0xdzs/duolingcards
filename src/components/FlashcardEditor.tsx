import React, { useState } from 'react';
import { ProcessedCard } from '../types';
import { Plus, Trash2, Save } from 'lucide-react';

interface FlashcardEditorProps {
  cards: ProcessedCard[];
  onSave: (cards: ProcessedCard[]) => void;
  onCancel: () => void;
}

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({ cards: initialCards, onSave, onCancel }) => {
  const [cards, setCards] = useState<ProcessedCard[]>(initialCards);

  const handleCardChange = (index: number, field: keyof ProcessedCard, value: string) => {
    const updatedCards = [...cards];
    updatedCards[index] = {
      ...updatedCards[index],
      [field]: value
    };
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([...cards, { front: '', back: '' }]);
  };

  const removeCard = (index: number) => {
    const updatedCards = [...cards];
    updatedCards.splice(index, 1);
    setCards(updatedCards);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty cards
    const validCards = cards.filter(card => card.front.trim() !== '' && card.back.trim() !== '');
    onSave(validCards);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Edit Flashcards</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 mb-6">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front (Term)
                </label>
                <input
                  type="text"
                  value={card.front}
                  onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Term"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Back (Definition)
                </label>
                <input
                  type="text"
                  value={card.back}
                  onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Definition"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label="Remove card"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={addCard}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            <Plus size={16} />
            Add Card
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <Save size={16} />
              Save Cards
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FlashcardEditor;
