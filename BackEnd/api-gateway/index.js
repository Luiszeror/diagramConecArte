require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 5050;
app.use(cors({
  origin: ['https://conecarte-v7d3.onrender.com','http://localhost:3000'], // tu frontend desplegado
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // si usas cookies o autenticación basada en sesiones
}));
// Importar rutas proxy
require('./routes/user')(app);
require('./routes/seller')(app);
require('./routes/review')(app);
require('./routes/product')(app);
require('./routes/payment')(app);
require('./routes/billing')(app);
require('./routes/image')(app);
require('./routes/conversation')(app);
require('./routes/message')(app);
require('./routes/cart')(app);

// Middleware opcional de logging
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

app.listen(port, () => {
  console.log(`API Gateway corriendo en http://localhost:${port}`);
});
