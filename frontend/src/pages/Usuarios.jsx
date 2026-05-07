import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
  Chip 
} from '@mui/material';
import api from '../services/api';
import UsuarioForm from '../components/UsuarioForm';
import UsuarioEditForm from '../components/UsuarioEditForm';

const JERARQUIA_ROLES = {
  'ADMIN': 1,
  'RECEPCIONISTA': 2,
  'PROFESIONAL': 3
};

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Lógica de ordenamiento de triple nivel
  const usuariosOrdenados = [...usuarios].sort((a, b) => {
    if (JERARQUIA_ROLES[a.rol] !== JERARQUIA_ROLES[b.rol]) {
      return JERARQUIA_ROLES[a.rol] - JERARQUIA_ROLES[b.rol];
    }
    if (a.rol === 'PROFESIONAL' && b.rol === 'PROFESIONAL') {
      const espA = a.Profesional?.especialidad || '';
      const espB = b.Profesional?.especialidad || '';
      if (espA !== espB) return espA.localeCompare(espB);
    }
    return a.nombre.localeCompare(b.nombre);
  });

  // ESTAS FUNCIONES ESTABAN COMENTADAS Y SON NECESARIAS:
  const agregarUsuario = (nuevo) => {
    cargarUsuarios(); 
  };

  const actualizarUsuario = (actualizado) => {
    cargarUsuarios();
    setUsuarioEditando(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Administrar usuarios</Typography>

      {/* Aquí se usa agregarUsuario */}
      <UsuarioForm onUsuarioCreado={agregarUsuario} />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Usuarios registrados</Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Rol</strong></TableCell>
              <TableCell><strong>Especialidad</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuariosOrdenados.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={u.rol} 
                    size="small" 
                    color={u.rol === 'ADMIN' ? 'primary' : u.rol === 'PROFESIONAL' ? 'secondary' : 'default'} 
                  />
                </TableCell>
                <TableCell>
                  {u.Profesional ? u.Profesional.especialidad : '-'}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setUsuarioEditando(u)}
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {usuarioEditando && (
        <UsuarioEditForm
          usuario={usuarioEditando}
          onUsuarioActualizado={actualizarUsuario}
          onCancelar={() => setUsuarioEditando(null)}
        />
      )}
    </Container>
  );
};

export default Usuarios;