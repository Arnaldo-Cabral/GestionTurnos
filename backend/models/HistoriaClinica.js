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
    unique: true
  },
  diagnostico: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tratamiento: {
    type: DataTypes.TEXT
  },
  observaciones: {
    type: DataTypes.TEXT
  },
  // Definimos la columna exactamente como está en tu SQL
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'historiaclinicas',
  timestamps: false // 👈 Desactivalo. Ya definimos fecha_registro arriba manualmente.
});

// Relación con Turno forzando la FK con guion bajo
HistoriaClinica.belongsTo(Turno, { foreignKey: 'turno_id' });

module.exports = HistoriaClinica;