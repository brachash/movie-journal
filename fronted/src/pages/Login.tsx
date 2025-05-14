import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/auth';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { token } = await login(email, password);
      setToken(token);
      navigate('/my-space');
    } catch (err: any) {
      setError(err.response?.data.message || 'התחברות נכשלה, אנא בדוק את פרטי ההתחברות שלך.');
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
      <div className="login-container">
        <h2>התחברות</h2>
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
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
        <p className="alternative-auth">
          אין לך חשבון? <a href="/signup">הירשם עכשיו</a>
        </p>
      </div>
    </div>
  );
};

export default Login;