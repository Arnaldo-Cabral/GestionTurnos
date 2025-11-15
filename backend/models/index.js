const Usuario = require('./Usuario');
const Recepcionista = require('./Recepcionista');
const Profesional = require('./Profesional');

// Relaciones
Usuario.hasOne(Recepcionista, { foreignKey: 'usuario_id' });
Recepcionista.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasOne(Profesional, { foreignKey: 'usuario_id' });
Profesional.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
  Usuario,
  Recepcionista,
  Profesional
};