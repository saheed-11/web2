import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About IEEE' },
    { path: '/events', label: 'Events' },
    { path: '/team', label: 'Team' },
    { path: '/projects', label: 'Projects' },
    { path: '/blog', label: 'Blog' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-r from-ieee-blue via-blue-600 to-blue-700'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 36 36" fill="none" className="transform transition-transform group-hover:rotate-12">
                <path d="M18 3L5 11V25L18 33L31 25V11L18 3Z" stroke="#0369a1" strokeWidth="2.2" fill="rgba(3,105,161,0.1)"/>
                <path d="M18 9L10 14V22L18 27L26 22V14L18 9Z" fill="rgba(3,105,161,0.2)"/>
                <circle cx="18" cy="18" r="3.5" fill="#0369a1"/>
              </svg>
            </div>
            <span className={`text-2xl font-bold font-display ${scrolled ? 'text-ieee-blue dark:text-blue-400' : 'text-white'}`}>
              IEEE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? scrolled
                      ? 'bg-ieee-blue text-white'
                      : 'bg-white/20 text-white'
                    : scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-200 ${
                scrolled
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Join Button */}
            <Link
              to="/contact"
              className={`hidden md:block px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                scrolled
                  ? 'bg-ieee-blue text-white hover:bg-ieee-blue-dark'
                  : 'bg-white text-ieee-blue hover:bg-gray-100'
              }`}
            >
              Join IEEE
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg ${
                scrolled
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-ieee-blue text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className="block w-full px-4 py-3 rounded-lg font-semibold bg-ieee-blue text-white text-center hover:bg-ieee-blue-dark"
                >
                  Join IEEE
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
