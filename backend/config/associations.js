// Importamos todos los modelos *después* de que todos se hayan definido
const Usuario = require('../models/Usuario');
const Profesional = require('../models/Profesional');
const Recepcionista = require('../models/Recepcionista');
const Turno = require('../models/Turno');
const Paciente = require('../models/Paciente');

// Función que define todas las relaciones
const setupAssociations = () => {
    
    // --- Relaciones Turno (Pertenece a) ---
    Turno.belongsTo(Paciente, { foreignKey: 'paciente_id' });
    Turno.belongsTo(Profesional, { foreignKey: 'profesional_id' });
    Turno.belongsTo(Recepcionista, { foreignKey: 'recepcionista_id' });

    // --- Relaciones de Perfil (Un Usuario tiene un perfil) ---
    // ❌ Se elimina el alias redundante 'as: "Usuario"' en estas dos líneas
    Profesional.belongsTo(Usuario, { foreignKey: 'usuario_id' });
    Recepcionista.belongsTo(Usuario, { foreignKey: 'usuario_id' });
    
    // --- Relaciones Inversas (Un perfil pertenece a un Usuario) ---
    Usuario.hasOne(Profesional, { foreignKey: 'usuario_id', as: 'profesional' });
    Usuario.hasOne(Recepcionista, { foreignKey: 'usuario_id', as: 'recepcionista' });
};

module.exports = setupAssociations;