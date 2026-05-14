import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStored = localStorage.getItem('user_data');

    if (token && userStored) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          logout();
        } else {
          // Cargamos el objeto completo con todos los IDs
          setUsuario(JSON.parse(userStored));
        }
      } catch (err) {
        console.error('Token inválido:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    try {
      // data viene del Login.jsx como res.data (contiene token y usuario)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.usuario));
      
      setUsuario(data.usuario);
      navigate('/');
    } catch (err) {
      console.error('Error al procesar login:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setUsuario(null);
    navigate('/login');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* import { createContext, useState, useEffect } from 'react';
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
}; */