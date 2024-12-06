import { useEffect, useState } from 'react';
import { Menu, X, Newspaper } from 'lucide-react';

export const Navbar = ({
  isLoggedIn,
  onLoginClick,
  onSignupClick,
  onProfileClick,
  onAddVacanciesClick,
  onVacanciesClick,
  onLogoutClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-indigo-600 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-8 w-8" />
            <span className="text-xl font-bold">Houzze</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={onVacanciesClick}
                  className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={onAddVacanciesClick}
                  className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors"
                >
                  Add Vacancy
                </button>
                <button
                  onClick={onProfileClick}
                  className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-500 transition-colors"
                >
                  Profile
                </button>
                <button
                  onClick={onLogoutClick}
                  className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-indigo-500"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-indigo-600 pb-2 px-4" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isLoggedIn ? (
            <>
              <button
                onClick={onVacanciesClick}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Home
              </button>
              <button
                onClick={onAddVacanciesClick}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Add Vacancy
              </button>
              <button
                onClick={onProfileClick}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={onLogoutClick}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};