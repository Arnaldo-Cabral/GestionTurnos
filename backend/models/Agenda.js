const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Agenda = sequelize.define('Agenda', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  profesional_id: { type: DataTypes.INTEGER, allowNull: false },
  dia_semana: {
    type: DataTypes.ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'),
    allowNull: false
  },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'agendas',
  timestamps: false
});

module.exports = Agenda;