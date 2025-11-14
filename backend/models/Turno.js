const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Paciente = require('./Paciente');
const Profesional = require('./Profesional');
const Recepcionista = require('./Recepcionista');

const Turno = sequelize.define('Turno', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  paciente_id: { type: DataTypes.INTEGER },
  profesional_id: { type: DataTypes.INTEGER },
  recepcionista_id: { type: DataTypes.INTEGER },
  fecha: { type: DataTypes.DATE, allowNull: false },
  estado: { type: DataTypes.ENUM('PENDIENTE', 'REALIZADO', 'CANCELADO'), defaultValue: 'PENDIENTE' }
});
Turno.belongsTo(Paciente, { foreignKey: 'paciente_id' });
Turno.belongsTo(Profesional, { foreignKey: 'profesional_id' });
Turno.belongsTo(Recepcionista, { foreignKey: 'recepcionista_id' });
module.exports = Turno;
