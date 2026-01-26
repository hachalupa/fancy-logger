// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signin', { username, password });
      console.log('LOGIN RESPONSE:', response.data);  // ← DEBUG
      
      
      login(response.data);
      
     
      const savedToken = localStorage.getItem('authToken');
      console.log('SAVED TOKEN:', savedToken);  // ← DEBUG
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('LOGIN ERROR:', err);  // ← DEBUG
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Fancy Logger</h1>
        <h2>Login</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            placeholder="Type your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          No account? <Link to="/register">Register</Link>
          <br/>
          <Link to="/forgot-password" style={{ fontSize: '12px' }}>Forgot password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
