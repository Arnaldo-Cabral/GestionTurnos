import { useContext, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button,
  Drawer, List, ListItemButton, ListItemText,
  Box, CssBaseline
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 240;

const Layout = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // 👈 para saber la ruta actual

  const menuItems = {
    ADMIN: [
      { text: 'Administrar usuarios', path: '/usuarios' }
    ],
    RECEPCIONISTA: [
      { text: 'Gestión Pacientes', path: '/pacientes' },
      { text: 'Crear Turnos', path: '/turnos' },
      { text: 'Gestionar Turnos', path: '/turnos/gestion' },
      { text: 'Historias clínicas', path: '/historias' }
    ],
    PROFESIONAL: [
      { text: 'Proximos turnos', path: '/mis-turnos' },
      { text: 'Historias clínicas', path: '/historias' },
      { text: 'Mi agenda', path: '/agenda' }
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
            <ListItemButton
              key={item.text}
              selected={location.pathname === item.path} // 👈 marca el activo
              onClick={() => navigate(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemText-root': { color: 'white' }
                },
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '& .MuiListItemText-root': { color: 'white' }
                }
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
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