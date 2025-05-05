import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDeckById, getCardsByDeckId, deleteCard } from '../services/flashcardService';
import { Deck, Card } from '../types';
import { ArrowLeft, Plus, Trash2, BookOpen } from 'lucide-react';
import FlashcardStudy from '../components/FlashcardStudy';
import toast from 'react-hot-toast';

const DeckDetailPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [studyMode, setStudyMode] = useState(false);

  useEffect(() => {
    const fetchDeckAndCards = async () => {
      if (deckId && user) {
        setLoading(true);
        const fetchedDeck = await getDeckById(deckId);
        
        if (fetchedDeck) {
          setDeck(fetchedDeck);
          const fetchedCards = await getCardsByDeckId(deckId);
          setCards(fetchedCards);
        }
        
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDeckAndCards();
    }
  }, [deckId, user, authLoading]);

  const handleDeleteCard = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      const success = await deleteCard(id);
      if (success) {
        setCards(cards.filter(card => card.id !== id));
        toast.success('Card deleted successfully');
      }
    }
  };

  const toggleStudyMode = () => {
    setStudyMode(!studyMode);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Deck Not Found</h2>
          <p className="text-gray-600 mb-6">
            The deck you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => navigate('/decks')}
            className="inline-flex items-center gap-2 py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <ArrowLeft size={16} />
            Back to Decks
          </button>
        </div>
      </div>
    );
  }

  if (studyMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <FlashcardStudy cards={cards} onClose={toggleStudyMode} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/decks')}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={16} />
        <span>Back to Decks</span>
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{deck.name}</h1>
            <p className="text-gray-600">{deck.description}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/create', { state: { deckId: deck.id } })}
              className="flex items-center gap-2 py-2 px-4 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
            >
              <Plus size={16} />
              Add Cards
            </button>
            
            <button
              onClick={toggleStudyMode}
              disabled={cards.length === 0}
              className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BookOpen size={16} />
              Study
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            Language: {deck.language}
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {cards.length} cards
          </span>
        </div>
      </div>
      
      {cards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Cards Yet</h2>
          <p className="text-gray-600 mb-6">
            Add cards to this deck to start studying!
          </p>
          <button
            onClick={() => navigate('/create', { state: { deckId: deck.id } })}
            className="inline-flex items-center gap-2 py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Plus size={16} />
            Add Cards
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {cards.map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="grid md:grid-cols-2 divide-x divide-gray-100">
                <div className="p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Front</h3>
                  <p className="text-lg">{card.front}</p>
                </div>
                <div className="p-6 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Back</h3>
                  <p className="text-lg">{card.back}</p>
                </div>
              </div>
              <div className="bg-gray-100 px-6 py-2 flex justify-end">
                <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeckDetailPage;
