require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/pacientes', require('./routes/pacienteRoutes'));
app.use('/api/profesionales', require('./routes/profesionalRoutes'));
app.use('/api/recepcionistas', require('./routes/recepcionistaRoutes'));
app.use('/api/turnos', require('./routes/turnoRoutes'));
app.use('/api/historias_clinicas', require('./routes/historiaClinicaRoutes'));
//ruta de agenda
app.use('/api/agenda', require('./routes/agendaRoutes'));


module.exports = app;
