import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ НОВОЕ: Функция валидации токена
  const validateToken = async (savedToken) => {
    if (!savedToken) return false;

    try {
      // Проверяем токен, запросив защищённый endpoint
      const response = await api.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${savedToken}`
        }
      });
      
      console.log('✅ TOKEN VALID:', response.data);
      return response.data; // Возвращаем данные пользователя
    } catch (error) {
      console.error('❌ TOKEN INVALID:', error.response?.status);
      return false;
    }
  };

  // ✅ НОВОЕ: Инициализация при старте
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('authUser');

      console.log('🔍 AUTH INIT - Checking token...');

      if (savedToken && savedUser) {
        // Валидируем токен перед установкой
        const userData = await validateToken(savedToken);
        
        if (userData) {
          // ✅ Токен валидный
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          console.log('✅ AUTH INITIALIZED - User logged in');
        } else {
          // ❌ Токен истёк - очищаем localStorage
          console.log('❌ TOKEN EXPIRED - Clearing storage');
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          setIsAuthenticated(false);
        }
      } else {
        console.log('⚪ NO SAVED TOKEN - User not authenticated');
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData) => {
    console.log('✅ LOGIN SUCCESSFUL:', userData.username);

    setUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      roles: userData.roles
    });
    setToken(userData.accessToken);
    setIsAuthenticated(true);

    localStorage.setItem('authToken', userData.accessToken);
    localStorage.setItem('authUser', JSON.stringify({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      roles: userData.roles
    }));
  };

  const logout = () => {
    console.log('🚪 LOGOUT');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated,  // ← НОВОЕ
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
