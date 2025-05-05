import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Duolingcards
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/decks" 
                  className={`hover:text-green-200 transition ${isActive('/decks') ? 'font-bold' : ''}`}
                >
                  My Decks
                </Link>
                <Link 
                  to="/create" 
                  className={`hover:text-green-200 transition ${isActive('/create') ? 'font-bold' : ''}`}
                >
                  Create Cards
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 hover:text-green-200 transition"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`hover:text-green-200 transition ${isActive('/login') ? 'font-bold' : ''}`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-100 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-green-700 px-4 py-2">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <Link 
                    to="/decks" 
                    className={`hover:text-green-200 transition ${isActive('/decks') ? 'font-bold' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    My Decks
                  </Link>
                  <Link 
                    to="/create" 
                    className={`hover:text-green-200 transition ${isActive('/create') ? 'font-bold' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Create Cards
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="flex items-center space-x-1 hover:text-green-200 transition"
                  >
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`hover:text-green-200 transition ${isActive('/login') ? 'font-bold' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-white text-green-600 px-4 py-2 rounded-md font-medium hover:bg-green-100 transition text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Duolingcards - Built with ChatAndBuild</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
