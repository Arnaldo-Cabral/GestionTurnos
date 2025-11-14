const jwt = require('jsonwebtoken');

// ====================================================================
// 1. VERIFICAR TOKEN (Autenticación)
// ====================================================================

exports.verifyToken = (req, res, next) => {
  // 1. Obtiene la cabecera "Authorization" completa (ej: "Bearer eyJhbGci...")
  const authHeader = req.headers['authorization'];
  
  // Verifica si la cabecera existe y comienza con "Bearer "
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // 401 Unauthorized (Falta el token o formato incorrecto)
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado o formato inválido.' });
  }

  // Extrae solo el token (elimina el prefijo "Bearer ")
  // [CORRECCIÓN PRINCIPAL] -> TOMA LA SEGUNDA PARTE DEL STRING
  const token = authHeader.split(' ')[1]; 

  try {
    // Intenta verificar el token usando el secreto del .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjunta los datos del usuario decodificados (id, email, rol) a la solicitud
    req.user = decoded; 
    next();
  } catch (err) {
    // 403 Forbidden (Token expirado, alterado o secreto incorrecto)
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};

// ====================================================================
// 2. VERIFICAR ROL (Autorización por Rol Específico)
// ====================================================================

// Middleware para verificar si el usuario es ADMIN
exports.isAdmin = (req, res, next) => {
  // Nota: req.user fue adjuntado por verifyToken
  if (!req.user || req.user.rol !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso restringido. Requiere rol de Administrador.' });
  }
  next();
};


// Middleware flexible: verifica si el rol está en un array de roles permitidos
// Útil para proteger rutas para RECEPCIONISTA o PROFESIONAL
exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // req.user contiene el rol decodificado del token
        if (!req.user || !allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ message: 'Acceso Denegado. Rol insuficiente.' });
        }
        next();
    };
};