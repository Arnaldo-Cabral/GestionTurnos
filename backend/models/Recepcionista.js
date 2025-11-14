const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Recepcionista = sequelize.define('Recepcionista', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  usuario_id: { type: DataTypes.INTEGER, unique: true }
}, {
    // =======================================================
    // LA CORRECCIÓN: ESPECIFICAR EL NOMBRE EXACTO DE LA TABLA
    // =======================================================
    tableName: 'recepcionistas', 
    
    // Si tus tablas de la BD tienen las columnas `createdAt` y `updatedAt`,
    // debes poner 'true'. Si no las tienen (como en tu modelo anterior),
    // déjalo en false. Lo mantendremos en false por consistencia:
    timestamps: false 
});
Recepcionista.belongsTo(Usuario, { foreignKey: 'usuario_id' });
module.exports = Recepcionista;
