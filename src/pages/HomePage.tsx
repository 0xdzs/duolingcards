import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Camera, BookOpen, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Turn Duolingo Screenshots into Flashcards
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Capture your Duolingo lessons, extract vocabulary automatically, and create digital flashcards for effective language learning.
        </p>
        
        {user ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Create Flashcards
            </Link>
            <Link
              to="/decks"
              className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-600 hover:bg-green-50 transition"
            >
              View My Decks
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-600 hover:bg-green-50 transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </section>
      
      <section className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Camera size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Screenshot</h3>
            <p className="text-gray-600">
              Take a screenshot of your Duolingo vocabulary lessons and upload it to our platform.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <Zap size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
            <p className="text-gray-600">
              Our AI extracts vocabulary pairs from your screenshot and formats them as flashcards.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="flex justify-center mb-4">
              <BookOpen size={48} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Study Anywhere</h3>
            <p className="text-gray-600">
              Review your flashcards anytime, anywhere to reinforce your language learning.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-green-50 rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Why Use Duolingcards?</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Save time by automatically extracting vocabulary</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Create organized decks for different languages or lessons</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Study with spaced repetition for better retention</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span>Access your flashcards from any device</span>
              </li>
            </ul>
          </div>
          
          <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Ready to enhance your language learning?</h3>
            {user ? (
              <Link
                to="/create"
                className="block w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition text-center"
              >
                Create Your First Deck
              </Link>
            ) : (
              <Link
                to="/register"
                className="block w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition text-center"
              >
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
