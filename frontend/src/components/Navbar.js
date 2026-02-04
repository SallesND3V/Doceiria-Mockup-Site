import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/galeria', label: 'Galeria' },
    { path: '/sobre', label: 'Sobre' },
    { path: '/contato', label: 'Contato' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-40 glass border-b border-paula-cream-dark/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <motion.div 
              className="text-2xl md:text-3xl font-heading font-bold text-paula-brown-dark"
              whileHover={{ scale: 1.05 }}
            >
              Paula Veiga
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.label.toLowerCase()}`}
                className={`relative font-body font-medium transition-colors ${
                  isActive(link.path) 
                    ? 'text-paula-brown-dark' 
                    : 'text-paula-brown hover:text-paula-brown-dark'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-paula-brown-dark rounded-full"
                  />
                )}
              </Link>
            ))}
            <a
              href="https://www.instagram.com/paula.veigacakes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-paula-brown hover:text-paula-brown-dark transition-colors"
              data-testid="instagram-link"
            >
              <Instagram size={22} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-paula-brown-dark p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-btn"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-paula-cream-dark"
          >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block font-body font-medium py-2 ${
                    isActive(link.path) 
                      ? 'text-paula-brown-dark' 
                      : 'text-paula-brown'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.instagram.com/paula.veigacakes/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-paula-brown py-2"
              >
                <Instagram size={20} /> @paula.veigacakes
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
