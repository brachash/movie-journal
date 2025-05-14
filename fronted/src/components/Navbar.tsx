import { useState, useContext, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // אפקט להוספת רקע כהה בעת גלילה
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // בדיקה אם המשתמש בדף התחברות או הרשמה - לא להציג את הnavbar
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuthPage) return null;

  return (
    <nav className={`netflix-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="netflix-navbar-container">
        <div className="netflix-navbar-left">
          <h1 className="netflix-navbar-logo">
            יומן<span className="red-highlight">סרטים</span>
          </h1>
          
          <button 
            className="netflix-hamburger" 
            onClick={toggleMenu}
            aria-label="תפריט"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        <ul className={`netflix-navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="nav-icon search-icon"></i>
              חיפוש
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-space"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="nav-icon space-icon"></i>
              המרחב שלי
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="nav-icon favorites-icon"></i>
              מועדפים
            </NavLink>
          </li>
        </ul>
        
        <div className="netflix-navbar-right">
          <button className="netflix-logout-button" onClick={handleLogout}>
            התנתק
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;