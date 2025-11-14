import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { usuario } = useContext(AuthContext);

  if (!usuario) return <Navigate to="/login" />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/unauthorized" />;

  return children;
};

export default PrivateRoute;