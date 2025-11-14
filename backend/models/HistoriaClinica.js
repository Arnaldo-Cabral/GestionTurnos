const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Turno = require('./Turno');

const HistoriaClinica = sequelize.define('HistoriaClinica', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  turno_id: { type: DataTypes.INTEGER, unique: true },
  diagnostico: { type: DataTypes.TEXT },
  tratamiento: { type: DataTypes.TEXT },
  observaciones: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});
HistoriaClinica.belongsTo(Turno, { foreignKey: 'turno_id' });
module.exports = HistoriaClinica;
