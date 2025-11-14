import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Uso:
 * <PrivateRoute roles={['ADMIN', 'RECEPCIONISTA']}>
 *   <ComponenteProtegido />
 * </PrivateRoute>
 */
const PrivateRoute = ({ children, roles }) => {
  const { usuario } = useContext(AuthContext);

  // No logueado
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles definidos, verificar acceso
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />;
  }

  // Acceso permitido
  return children;
};

export default PrivateRoute;