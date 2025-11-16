import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  TextField,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Delete, Edit, Save, Cancel } from '@mui/icons-material';

const AgendaList = () => {
  const [agendas, setAgendas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const token = localStorage.getItem('token');

  const fetchAgendas = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/agenda', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendas(response.data);
    } catch (error) {
      console.error('Error al obtener agendas:', error);
    }
  };

  useEffect(() => {
    fetchAgendas();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/agenda/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAgendas();
    } catch (error) {
      console.error('Error al eliminar agenda:', error);
    }
  };

  const handleEdit = (agenda) => {
    setEditId(agenda.id);
    setEditData({
      dia_semana: agenda.dia_semana,
      hora_inicio: agenda.hora_inicio,
      hora_fin: agenda.hora_fin,
    });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/api/agenda/${editId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditId(null);
      setEditData({});
      fetchAgendas();
    } catch (error) {
      console.error('Error al actualizar agenda:', error);
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Bloques de agenda cargados
      </Typography>
      <List>
        {agendas.map((agenda) => (
          <ListItem key={agenda.id} divider>
            {editId === agenda.id ? (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <Select
                  value={editData.dia_semana}
                  onChange={(e) => setEditData({ ...editData, dia_semana: e.target.value })}
                >
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map((dia) => (
                    <MenuItem key={dia} value={dia}>{dia}</MenuItem>
                  ))}
                </Select>
                <TextField
                  type="time"
                  value={editData.hora_inicio}
                  onChange={(e) => setEditData({ ...editData, hora_inicio: e.target.value })}
                />
                <TextField
                  type="time"
                  value={editData.hora_fin}
                  onChange={(e) => setEditData({ ...editData, hora_fin: e.target.value })}
                />
                <IconButton onClick={handleSave}><Save /></IconButton>
                <IconButton onClick={handleCancel}><Cancel /></IconButton>
              </Stack>
            ) : (
              <>
                <ListItemText
                  primary={`${agenda.dia_semana}: ${agenda.hora_inicio} - ${agenda.hora_fin}`}
                />
                <IconButton onClick={() => handleEdit(agenda)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(agenda.id)}><Delete /></IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default AgendaList;