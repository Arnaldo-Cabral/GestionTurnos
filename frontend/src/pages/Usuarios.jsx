// src/pages/Usuarios.jsx
import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import UsuarioForm from '../components/UsuarioForm';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  const cargarUsuarios = async () => {
    const res = await api.get('/usuarios');
    setUsuarios(res.data);
  };

  const eliminarUsuario = async (id) => {
    if (confirm('¿Eliminar este usuario?')) {
      await api.delete(`/usuarios/${id}`);
      cargarUsuarios();
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Panel de Administración de Usuarios</Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Listado</Typography>
      <List>
        {usuarios.map(u => (
          <ListItem key={u.id} secondaryAction={
            <>
              <IconButton onClick={() => setSeleccionado(u)}>✏️</IconButton>
              <IconButton onClick={() => eliminarUsuario(u.id)}><DeleteIcon /></IconButton>
            </>
          }>
            {u.nombre} ({u.rol}) - {u.email}
          </ListItem>
        ))}
      </List>
      {seleccionado && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6">Editar Usuario</Typography>
          <UsuarioForm usuario={seleccionado} onSuccess={() => {
            setSeleccionado(null);
            cargarUsuarios();
          }} />
        </>
      )}
    </Container>
  );
};

export default Usuarios;