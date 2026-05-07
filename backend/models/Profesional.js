const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Profesional = sequelize.define('Profesional', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    unique: true
  },
  especialidad: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  matricula: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  intervalo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 20 // Por defecto 20 minutos
  }
}, {
  tableName: 'profesionales',
  timestamps: false
});

module.exports = Profesional;