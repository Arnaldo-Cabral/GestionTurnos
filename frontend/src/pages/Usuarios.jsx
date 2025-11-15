import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, Divider, Button } from '@mui/material';
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

      <Typography variant="h6" sx={{ mt: 4 }}>Usuarios registrados</Typography>
      <List>
        {usuarios.map((u) => (
          <div key={u.id}>
            <ListItem
              secondaryAction={
                <Button variant="outlined" onClick={() => setUsuarioEditando(u)}>Editar</Button>
              }
            >
              {u.nombre} — {u.email} — {u.rol}
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>

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