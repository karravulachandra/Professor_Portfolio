import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { colorThemes } from '../data/portfolioData';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { isDarkMode, toggleDarkMode, primaryColor, setPrimaryColor } = useTheme();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/profile', label: 'Profile' },
    { path: '/experience', label: 'Experience' },
    { path: '/publications', label: 'Publications' },
    { path: '/workshops', label: 'Workshops' },
    { path: '/sttp', label: 'STTP' },
    { path: '/courses', label: 'Courses' },
    { path: '/patents', label: 'Patents' },
    { path: '/projects', label: 'Projects' },
    { path: '/committees', label: 'Committees' }
  ];

  const colorClasses: Record<string, string> = {
    'blue': 'bg-blue-600 text-blue-600 hover:bg-blue-700',
    'purple': 'bg-purple-600 text-purple-600 hover:bg-purple-700',
    'indigo': 'bg-indigo-600 text-indigo-600 hover:bg-indigo-700',
    'teal': 'bg-teal-600 text-teal-600 hover:bg-teal-700',
    'cyan': 'bg-cyan-600 text-cyan-600 hover:bg-cyan-700',
    'pink': 'bg-pink-600 text-pink-600 hover:bg-pink-700'
  };

  const primaryColorClass = colorClasses[primaryColor] || colorClasses.blue;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <GraduationCap className={`h-8 w-8 ${primaryColorClass.split(' ')[1]}`} />
                <span className="text-xl font-bold dark:text-white">Portfolio</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      primaryColor === 'blue'
                        ? 'hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Theme and Color Controls */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Color Picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className={`w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 transition-all hover:scale-110 ${primaryColorClass.split(' ')[0]}`}
                  />
                  {showColorPicker && (
                    <div className="absolute right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex gap-2">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => {
                            setPrimaryColor(theme.value);
                            setShowColorPicker(false);
                          }}
                          className={`w-6 h-6 rounded-full border-2 transition-all ${
                            primaryColor === theme.value
                              ? 'border-gray-900 dark:border-white scale-110'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          style={{ backgroundColor: theme.hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 dark:text-white" />
                ) : (
                  <Menu className="h-6 w-6 dark:text-white" />
                )}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="lg:hidden mt-4 space-y-2 pb-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      primaryColor === 'blue'
                        ? 'hover:bg-blue-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                {/* Mobile Theme Controls */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => {
                          setPrimaryColor(theme.value);
                          setIsMenuOpen(false);
                        }}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          primaryColor === theme.value
                            ? 'border-gray-900 dark:border-white scale-110'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: theme.hex }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-80px)]">
          {children}
        </main>

        {/* Footer */}
        <footer className={`py-8 text-center border-t border-gray-200 dark:border-gray-700 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="container mx-auto px-4">
            <p className="text-gray-600 dark:text-gray-400">© 2024 Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
