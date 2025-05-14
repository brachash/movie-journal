import { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">יומן סרטים</h1>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <NavLink
              to="/search"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              חיפוש
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-space"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              המרחב שלי
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              מועדפים
            </NavLink>
          </li>
          <li>
            <button className="logout-button" onClick={handleLogout}>
              התנתק
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;