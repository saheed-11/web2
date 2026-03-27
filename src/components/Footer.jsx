import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send to a backend
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    'Quick Links': [
      { label: 'Home', path: '/' },
      { label: 'About IEEE', path: '/about' },
      { label: 'Events', path: '/events' },
      { label: 'Team', path: '/team' },
    ],
    'Resources': [
      { label: 'Projects', path: '/projects' },
      { label: 'Blog', path: '/blog' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Contact', path: '/contact' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      <div className="container-custom px-4">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ieee-blue rounded-lg flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <path d="M18 3L5 11V25L18 33L31 25V11L18 3Z" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.1)"/>
                  <circle cx="18" cy="18" r="3" fill="white"/>
                </svg>
              </div>
              <span className="text-2xl font-bold font-display text-white">IEEE</span>
            </div>
            <p className="text-sm leading-relaxed">
              IEEE Student Branch at Carmel College of Engineering and Technology.
              Advancing technology for the benefit of humanity through innovation and collaboration.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-ieee-blue rounded-lg flex items-center justify-center transition-colors duration-200 text-sm font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-ieee-blue rounded-lg flex items-center justify-center transition-colors duration-200 text-sm font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-ieee-blue rounded-lg flex items-center justify-center transition-colors duration-200 text-sm font-bold"
                aria-label="Twitter"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Quick Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-ieee-blue transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Stay Connected</h3>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex items-start space-x-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href="mailto:ieeecarmelcollege@gmail.com" className="hover:text-ieee-blue transition-colors">
                  ieeecarmelcollege@gmail.com
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <a href="tel:+919778012972" className="hover:text-ieee-blue transition-colors">
                  +91 97780 12972
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>Punnapra P.O., Alappuzha, Kerala, India - 688004</span>
              </div>
            </div>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-ieee-blue text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-ieee-blue hover:bg-ieee-blue-dark px-4 py-2 rounded-r-lg transition-colors duration-200"
                  aria-label="Subscribe"
                >
                  <Send size={18} />
                </button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-xs"
                >
                  ✓ Subscribed successfully!
                </motion.p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} IEEE Student Branch, Carmel College. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-ieee-blue transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-ieee-blue transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
