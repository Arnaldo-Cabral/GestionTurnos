/* const { DataTypes } = require('sequelize');
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
 */


/* BORRAR DE ACA PARA ABAJO
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
    // 👈 sin unique aquí, lo manejás en validaciones si querés
  },
  password: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  rol: { 
    type: DataTypes.ENUM('ADMIN', 'RECEPCIONISTA', 'PROFESIONAL'), 
    allowNull: false 
  },
  activo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

// =======================================================
// Asociaciones inversas (definidas inmediatamente)
// =======================================================
const Profesional = require('./Profesional');
const Recepcionista = require('./Recepcionista');

Usuario.hasOne(Profesional, {
  foreignKey: 'usuario_id',
  as: 'profesional'
});

Usuario.hasOne(Recepcionista, {
  foreignKey: 'usuario_id',
  as: 'recepcionista'
});

module.exports = Usuario; */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
    // 👈 sin unique aquí, lo manejás en validaciones si querés
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('ADMIN', 'RECEPCIONISTA', 'PROFESIONAL'),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;