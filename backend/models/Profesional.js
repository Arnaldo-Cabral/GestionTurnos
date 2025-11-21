/* const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Profesional = sequelize.define('Profesional', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, unique: true },
  especialidad: { type: DataTypes.STRING(100), allowNull: false },
  matricula: { type: DataTypes.STRING(50), allowNull: false }
}, {
    // =======================================================
    // 🚨 CORRECCIÓN: ESPECIFICAR EL NOMBRE DE LA TABLA EN PLURAL
    // =======================================================
    tableName: 'profesionales',
    // Mantenemos 'timestamps' en false, asumiendo que tus tablas de BD no tienen estas columnas
    timestamps: false
});
Profesional.belongsTo(Usuario, { foreignKey: 'usuario_id' });
module.exports = Profesional;
 */
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
  }
}, {
  tableName: 'profesionales',
  timestamps: false
});

module.exports = Profesional;