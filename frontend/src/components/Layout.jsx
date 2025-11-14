import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button,
  Drawer, List, ListItem, ListItemText,
  Box, CssBaseline
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 240;

const Layout = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuItems = {
    ADMIN: [
      { text: 'Usuarios', path: '/usuarios' },
      { text: 'Pacientes', path: '/pacientes' },
      { text: 'Turnos', path: '/turnos' }
    ],
    RECEPCIONISTA: [
      { text: 'Pacientes', path: '/pacientes' },
      { text: 'Turnos', path: '/turnos' },
      { text: 'Historias clínicas', path: '/historias' }
    ],
    PROFESIONAL: [
      { text: 'Historias clínicas', path: '/historias' }
    ]
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar superior */}
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {usuario?.nombre} ({usuario?.rol})
          </Typography>
          <Button color="inherit" onClick={logout}>Cerrar sesión</Button>
        </Toolbar>
      </AppBar>

      {/* Drawer lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <List>
          {menuItems[usuario?.rol]?.map(item => (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;