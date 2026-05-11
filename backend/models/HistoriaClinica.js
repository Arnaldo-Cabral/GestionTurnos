const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Turno = require('./Turno');

const HistoriaClinica = sequelize.define('HistoriaClinica', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  turno_id: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false // 👈 Agregado: Una historia siempre debe pertenecer a un turno
  },
  // 👈 AGREGAR ESTO: Es el campo que faltaba
  motivo_consulta: {
    type: DataTypes.TEXT,
    allowNull: false // 👈 Obligatorio
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: false // 👈 Obligatorio
  },
  tratamiento: {
    type: DataTypes.TEXT,
    allowNull: false // 👈 Agregado: No puede estar vacío por ley
  },
  observaciones: {
    type: DataTypes.TEXT
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'historiaclinicas',
  timestamps: false 
});

HistoriaClinica.belongsTo(Turno, { foreignKey: 'turno_id' });

module.exports = HistoriaClinica;