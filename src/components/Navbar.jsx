import React, { useState } from 'react';
import { Menu, X, Calendar, Trophy } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Trophy className="brand-icon" />
          <span className="brand-text">
            Sports<span className="brand-accent">Orca</span>
          </span>
        </div>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#matches" className="nav-link">
            <Calendar size={18} />
            Matches
          </a>
          <a href="#leagues" className="nav-link">
            <Trophy size={18} />
            Leagues
          </a>
          <a href="#about" className="nav-link">
            About
          </a>
        </div>

        <button 
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;