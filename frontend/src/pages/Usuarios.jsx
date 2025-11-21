// src/pages/Usuarios.jsx
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
  Divider
} from '@mui/material';
import api from '../services/api';
import UsuarioForm from '../components/UsuarioForm';
import UsuarioEditForm from '../components/UsuarioEditForm';

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

  const agregarUsuario = (nuevo) => {
    setUsuarios((prev) => [...prev, nuevo]);
  };

  const actualizarUsuario = (actualizado) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === actualizado.id ? actualizado : u))
    );
    setUsuarioEditando(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Administrar usuarios</Typography>

      <UsuarioForm onUsuarioCreado={agregarUsuario} />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Usuarios registrados</Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Rol</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell>
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