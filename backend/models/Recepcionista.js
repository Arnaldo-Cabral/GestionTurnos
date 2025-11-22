const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Recepcionista = sequelize.define('Recepcionista', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    unique: true
  }
}, {
  tableName: 'recepcionistas',
  timestamps: false
});

module.exports = Recepcionista;
