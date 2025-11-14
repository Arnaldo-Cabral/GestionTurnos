import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsuario(decoded);
      } catch (err) {
        console.error('Token inválido:', err);
        localStorage.removeItem('token');
        setUsuario(null);
      }
    }
  }, []);

  // Iniciar sesión
  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      setUsuario(decoded);
      navigate('/');
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUsuario(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};