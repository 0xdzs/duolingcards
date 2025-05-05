import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDecks, deleteDeck } from '../services/flashcardService';
import { Deck } from '../types';
import { Plus, Trash2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const DecksPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecks = async () => {
      if (user) {
        setLoading(true);
        const fetchedDecks = await getDecks();
        setDecks(fetchedDecks);
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDecks();
    }
  }, [user, authLoading]);

  const handleDeleteDeck = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      const success = await deleteDeck(id);
      if (success) {
        setDecks(decks.filter(deck => deck.id !== id));
        toast.success('Deck deleted successfully');
      }
    }
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Flashcard Decks</h1>
        <Link
          to="/create"
          className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          <Plus size={16} />
          Create New Deck
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : decks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Decks Yet</h2>
          <p className="text-gray-600 mb-6">
            Create your first flashcard deck to start learning!
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Plus size={16} />
            Create Deck
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {decks.map(deck => (
            <div key={deck.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{deck.name}</h2>
                <p className="text-gray-600 mb-4">{deck.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Language: {deck.language}</span>
                  <span>{deck.card_count || 0} cards</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-between">
                <button
                  onClick={() => handleDeleteDeck(deck.id)}
                  className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
                <Link
                  to={`/decks/${deck.id}`}
                  className="text-green-600 hover:text-green-800 transition flex items-center gap-1"
                >
                  <BookOpen size={16} />
                  <span>View & Study</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DecksPage;
