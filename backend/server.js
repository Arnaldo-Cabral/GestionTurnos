/* require('dotenv').config(); */
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});
