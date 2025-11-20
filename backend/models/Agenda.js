const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Profesional = require('./Profesional');

const Agenda = sequelize.define('Agenda', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  profesional_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dia_semana: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'agendas',   // 👈 nombre correcto de la tabla
  timestamps: false
});

// Relación con Profesional
Agenda.belongsTo(Profesional, { foreignKey: 'profesional_id' });

module.exports = Agenda;