import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBusinessTime, faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/navbar.css';
import { Button } from './ui/Button'

export function Navbar({ 
  variant = 'landing', // 'landing' или 'dashboard'
  user = null,
  activeTab = null,
  onTabChange = null,
  onLogout = null,
  tasks = [],
  types = []
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    if (onLogout) onLogout();
  };

  // ===== LANDING NAVBAR =====
  if (variant === 'landing') {
    return (
      <>
        <nav className="navbar">
          <a href="/" className="navbar-logo">
            <FontAwesomeIcon icon={faBusinessTime} /> Fancy Logger
          </a>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); }}>
              Features
            </a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavClick('#pricing'); }}>
              Pricing
            </a>
            <Button  variant="primary" size="sm" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="navbar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} />
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        <div className={`navbar-mobile ${mobileMenuOpen ? 'open' : ''}`}>
          <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); }}>
            Features
          </a>
          <a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavClick('#pricing'); }}>
            Pricing
          </a>
          <Button
            variant="primary" 
            size="lg"
            style={{ width: '100%' }}
            onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
          >
            Sign In
          </Button>
        </div>
      </>
    );
  }

  // ===== DASHBOARD NAVBAR =====
  return (
    <>
      <nav className="navbar">
        <a href="/dashboard" className="navbar-logo">
        <FontAwesomeIcon icon={faBusinessTime} /> Fancy Logger
        </a>
        

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          < a
            className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
            onClick={() => onTabChange?.('log')}
          >
        Time Logger
          </a>
          <a href='/projects' className="tab-btn">
        Projects
          </a>
          { user?.roles[0] === "ROLE_ADMIN" && (
            <a 
                className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
                onClick={() => onTabChange?.('tasks')}
            >
            Tasks ({tasks?.length || 0})
            </a>
          )}
           
          <a
            className={`tab-btn ${activeTab === 'types' ? 'active' : ''}`}
            onClick={() => onTabChange?.('types')}
          >
        Types ({types?.length || 0})
          </a>

          <div className="navbar-right">
            <span className="username">Hi, {user?.username}</span>
            <Button className="btn-secondary" onClick={handleLogout}>
            Logout
            </Button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} />
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`navbar-mobile ${mobileMenuOpen ? 'open' : ''}`}>
        <a
          className={`tab-btn ${activeTab === 'log' ? 'active' : ''}`}
          onClick={() => { onTabChange?.('log'); setMobileMenuOpen(false); }}
        >
        Time Logger
        </a>
        <a href="/projects" className="tab-btn" onClick={() => setMobileMenuOpen(false)}>
        Projects
        </a>
        { user?.roles[0] === "ROLE_ADMIN" && (
        <a
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => { onTabChange?.('tasks'); setMobileMenuOpen(false); }}
        >
        Tasks ({tasks?.length || 0})
        </a>
        )}
        <a
          className={`tab-btn ${activeTab === 'types' ? 'active' : ''}`}
          onClick={() => { onTabChange?.('types'); setMobileMenuOpen(false); }}
        >
        Types ({types?.length || 0})
        </a>
        <Button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ width: '100%', marginTop: '1rem' }}
        >
        Logout
        </Button>
      </div>
    </>
  );
}
