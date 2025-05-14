import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../services/auth';
import '../styles/auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // וידוא שהסיסמאות תואמות
    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות, אנא נסה שוב.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await signup(email, password);
      const { token } = response;
      if (!token) {
        throw new Error('לא התקבל טוקן מההרשמה');
      }
      localStorage.setItem('token', token); 
      setToken(token);
      navigate('/search');
    } catch (err: any) {
      console.error('Signup error:', err); 
      setError(err.response?.data.message || err.message || 'ההרשמה נכשלה, אנא נסה שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  // אפקט הנפשה למעבר בין שדות
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.transform = 'scale(1.02)';
    e.target.style.boxShadow = '0 0 0 2px rgba(229, 9, 20, 0.3)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.transform = 'scale(1)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="auth-page-container">
      <div className="signup-container">
        <h2>הרשמה</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="אימייל"
              required
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              required
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              minLength={6}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="אימות סיסמה"
              required
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'יוצר חשבון...' : 'הירשם'}
          </button>
        </form>
        <p className="alternative-auth">
          כבר יש לך חשבון? <a href="/login">התחבר עכשיו</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;