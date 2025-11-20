const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false }, // 👈 sin unique aquí
  password: { type: DataTypes.STRING(255), allowNull: false },
  rol: { type: DataTypes.ENUM('ADMIN', 'RECEPCIONISTA', 'PROFESIONAL'), allowNull: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Usuario;
