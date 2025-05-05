import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ImageUploader from '../components/ImageUploader';
import FlashcardEditor from '../components/FlashcardEditor';
import { performOCR, processWithAI } from '../services/ocrService';
import { createDeck, createCards } from '../services/flashcardService';
import { ProcessedCard } from '../types';
import toast from 'react-hot-toast';

const CreatePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const existingDeckId = location.state?.deckId;
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [language, setLanguage] = useState('Spanish');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState('');
  const [processedCards, setProcessedCards] = useState<ProcessedCard[]>([]);
  const [deckId, setDeckId] = useState<string | null>(existingDeckId || null);

  useEffect(() => {
    if (existingDeckId) {
      setDeckId(existingDeckId);
      setStep(3); // Skip to image upload if deck already exists
    }
  }, [existingDeckId]);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deckName.trim() || !language.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const newDeck = await createDeck({
        name: deckName,
        description: deckDescription,
        language: language
      });
      
      if (newDeck) {
        setDeckId(newDeck.id);
        setStep(2);
        toast.success('Deck created successfully!');
      }
    } catch (error) {
      console.error('Error creating deck:', error);
      toast.error('Failed to create deck');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessImage = async () => {
    if (!imageFile) {
      toast.error('Please upload an image first');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await performOCR(imageFile);
      
      if (result) {
        setOcrResult(result.text);
        
        // Process with AI
        const cards = await processWithAI(result.text, language);
        
        if (cards && cards.length > 0) {
          setProcessedCards(cards);
          setStep(3);
          toast.success(`Extracted ${cards.length} flashcards!`);
        } else {
          toast.error('Could not extract any flashcards from the image');
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCards = async (cards: ProcessedCard[]) => {
    if (!deckId) {
      toast.error('No deck selected');
      return;
    }
    
    if (cards.length === 0) {
      toast.error('Please add at least one card');
      return;
    }
    
    setLoading(true);
    
    try {
      const cardsToCreate = cards.map(card => ({
        deck_id: deckId,
        front: card.front,
        back: card.back
      }));
      
      const result = await createCards(cardsToCreate);
      
      if (result) {
        toast.success('Cards saved successfully!');
        navigate(`/decks/${deckId}`);
      }
    } catch (error) {
      console.error('Error saving cards:', error);
      toast.error('Failed to save cards');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (deckId) {
      navigate(`/decks/${deckId}`);
    } else {
      navigate('/decks');
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
      <h1 className="text-2xl font-bold mb-6">
        {existingDeckId ? 'Add Cards to Deck' : 'Create New Flashcards'}
      </h1>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-700">Processing...</p>
          </div>
        </div>
      )}
      
      {step === 1 && !existingDeckId && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 1: Create a Deck</h2>
          
          <form onSubmit={handleCreateDeck} className="space-y-4">
            <div>
              <label htmlFor="deckName" className="block text-sm font-medium text-gray-700 mb-1">
                Deck Name *
              </label>
              <input
                id="deckName"
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Spanish Basics"
              />
            </div>
            
            <div>
              <label htmlFor="deckDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="deckDescription"
                value={deckDescription}
                onChange={(e) => setDeckDescription(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Common Spanish phrases and vocabulary"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language *
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Dutch">Dutch</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Chinese">Chinese</option>
                <option value="Russian">Russian</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
      
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Step 2: Upload Duolingo Screenshot</h2>
          
          <div className="mb-6">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              disabled={loading}
              className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            <button
              onClick={handleProcessImage}
              disabled={!imageFile || loading}
              className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Process Image
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div>
          {existingDeckId ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Step 1: Upload Duolingo Screenshot</h2>
              
              <div className="mb-6">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleProcessImage}
                  disabled={!imageFile || loading}
                  className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Process Image
                </button>
              </div>
            </div>
          ) : (
            processedCards.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 3: Edit Flashcards</h2>
                <FlashcardEditor 
                  cards={processedCards} 
                  onSave={handleSaveCards} 
                  onCancel={handleCancel} 
                />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePage;
