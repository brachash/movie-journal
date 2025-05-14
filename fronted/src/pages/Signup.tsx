import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../services/auth';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signup(email, password);
      const { token } = response;
      if (!token) {
        throw new Error('No token received from signup');
      }
      localStorage.setItem('token', token); 
      setToken(token);
      navigate('/search');
    } catch (err: any) {
      console.error('Signup error:', err); 
      setError(err.response?.data.message || err.message || 'ההרשמה נכשלה');
    }
  };


  return (
    <div className="login-container">
      <h2>הרשמה</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">סיסמה</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">הירשם</button>
      </form>
      <p>
        כבר יש לך חשבון? <a href="/login">התחבר</a>
      </p>
    </div>
  );
};

export default Signup;