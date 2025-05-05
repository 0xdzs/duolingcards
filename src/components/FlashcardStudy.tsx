import React, { useState, useEffect } from 'react';
import { Card } from '../types';
import ReactCardFlip from 'react-card-flip';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface FlashcardStudyProps {
  cards: Card[];
  onClose: () => void;
}

const FlashcardStudy: React.FC<FlashcardStudyProps> = ({ cards, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Card[]>([]);

  useEffect(() => {
    // Initialize with shuffled cards
    shuffleCards();
  }, [cards]);

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  if (shuffledCards.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-lg mb-4">No cards available to study.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Back to Deck
        </button>
      </div>
    );
  }

  const currentCard = shuffledCards[currentIndex];
  const progress = `${currentIndex + 1} / ${shuffledCards.length}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Study Flashcards</h2>
        <div className="text-sm text-gray-600">{progress}</div>
      </div>
      
      <div className="mb-8">
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          {/* Front of card */}
          <div 
            onClick={handleCardClick}
            className="bg-gray-50 border rounded-lg p-8 h-64 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
          >
            <p className="text-xl font-medium text-center">{currentCard.front}</p>
          </div>
          
          {/* Back of card */}
          <div 
            onClick={handleCardClick}
            className="bg-green-50 border border-green-200 rounded-lg p-8 h-64 flex items-center justify-center cursor-pointer hover:bg-green-100 transition"
          >
            <p className="text-xl font-medium text-center">{currentCard.back}</p>
          </div>
        </ReactCardFlip>
        
        <p className="text-center text-sm text-gray-500 mt-2">
          Click the card to flip
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <button
          onClick={shuffleCards}
          className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition"
        >
          <RotateCcw size={16} />
          <span>Shuffle</span>
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center p-2 rounded-md ${
              currentIndex === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === shuffledCards.length - 1}
            className={`flex items-center justify-center p-2 rounded-md ${
              currentIndex === shuffledCards.length - 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default FlashcardStudy;
