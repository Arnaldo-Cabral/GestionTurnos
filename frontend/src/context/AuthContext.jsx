import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 NUEVO: Estado de carga
  const navigate = useNavigate();

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Opcional: Verificar si el token expiró
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setUsuario(null);
        } else {
          setUsuario(decoded);
        }
      } catch (err) {
        console.error('Token inválido:', err);
        localStorage.removeItem('token');
      }
    }
    setLoading(false); // 👈 Terminó de verificar
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

  // 👈 IMPORTANTE: No renderizar la app hasta que sepamos si hay usuario
  if (loading) {
    return null; // O un spinner/cargando...
  }
  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};