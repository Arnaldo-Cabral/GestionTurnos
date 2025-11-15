import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Pacientes from './pages/Pacientes';
import Turnos from './pages/Turnos';
import Historias from './pages/Historias';
import Login from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas protegidas con layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/usuarios" element={
          <PrivateRoute roles={['ADMIN']}><Usuarios /></PrivateRoute>
        } />
        <Route path="/pacientes" element={
          <PrivateRoute roles={['RECEPCIONISTA']}><Pacientes /></PrivateRoute>
        } />
        <Route path="/turnos" element={
          <PrivateRoute roles={['RECEPCIONISTA']}><Turnos /></PrivateRoute>
        } />
        <Route path="/historias" element={
          <PrivateRoute roles={['RECEPCIONISTA', 'PROFESIONAL']}><Historias /></PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;