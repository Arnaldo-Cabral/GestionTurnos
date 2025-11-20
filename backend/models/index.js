/* const Usuario = require('./Usuario');
const Recepcionista = require('./Recepcionista');
const Profesional = require('./Profesional');
const Agenda = require('./Agenda');
const Turno = require('./Turno');

// Relaciones
Usuario.hasOne(Recepcionista, { foreignKey: 'usuario_id' });
Recepcionista.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasOne(Profesional, { foreignKey: 'usuario_id' });
Profesional.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Profesional.hasMany(Agenda, { foreignKey: 'profesional_id' });
Agenda.belongsTo(Profesional, { foreignKey: 'profesional_id' });


module.exports = {
  Usuario,
  Recepcionista,
  Profesional,
  Agenda,
  Turno
}; */
const Usuario = require('./Usuario');
const Recepcionista = require('./Recepcionista');
const Profesional = require('./Profesional');
const Agenda = require('./Agenda');
const Turno = require('./Turno');
const Paciente = require('./Paciente'); // <-- si ya tenés el modelo Paciente

// Relaciones Usuario ↔ Recepcionista
Usuario.hasOne(Recepcionista, { foreignKey: 'usuario_id' });
Recepcionista.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relaciones Usuario ↔ Profesional
Usuario.hasOne(Profesional, { foreignKey: 'usuario_id' });
Profesional.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Relaciones Profesional ↔ Agenda
Profesional.hasMany(Agenda, { foreignKey: 'profesional_id' });
Agenda.belongsTo(Profesional, { foreignKey: 'profesional_id' });

// Relaciones Profesional ↔ Turno
Profesional.hasMany(Turno, { foreignKey: 'profesional_id' });
Turno.belongsTo(Profesional, { foreignKey: 'profesional_id' });

// Relaciones Recepcionista ↔ Turno
Recepcionista.hasMany(Turno, { foreignKey: 'recepcionista_id' });
Turno.belongsTo(Recepcionista, { foreignKey: 'recepcionista_id' });

// Relaciones Paciente ↔ Turno
Paciente.hasMany(Turno, { foreignKey: 'paciente_id' });
Turno.belongsTo(Paciente, { foreignKey: 'paciente_id' });

module.exports = {
  Usuario,
  Recepcionista,
  Profesional,
  Agenda,
  Turno,
  Paciente
};