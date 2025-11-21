 /* require('dotenv').config(); */
/* const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}); */
const app = require('./app');
const sequelize = require('./config/db');
// 🚨 Importamos el archivo que define todas las asociaciones de Sequelize
const setupAssociations = require('./config/associations'); 

const PORT = process.env.PORT || 3001;

// ----------------------------------------------------------------------
// PASO 1: Llamamos a setupAssociations para registrar todas las
// relaciones (belongsTo, hasOne, etc.) inmediatamente. 
// Esto resuelve el error de dependencia circular (el que dio 'belongsTo called with something that's not a subclass').
setupAssociations();
// ----------------------------------------------------------------------


// PASO 2: Sincronizamos la base de datos (una vez que todas las relaciones están definidas)
sequelize.sync({ alter: true }).then(() => {
  
  // PASO 3: Iniciamos el servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  });
}).catch(error => {
    // Manejo de errores en caso de que la conexión o sincronización falle
    console.error('❌ Error al conectar y sincronizar la base de datos:', error.message);
    process.exit(1); // Sale del proceso si la BD falla
});

