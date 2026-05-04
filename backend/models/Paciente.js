const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Paciente = sequelize.define('Paciente', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  dni: { type: DataTypes.STRING(20), allowNull: false }, // 👈 sin unique aquí
  fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
  telefono: { type: DataTypes.STRING(20) },
  direccion: { type: DataTypes.STRING(255) }
}, {
  sequelize,
  tableName: 'pacientes',
  timestamps: false
});

module.exports = Paciente;
