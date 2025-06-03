require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5007;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const pagosRoutes = require("./routes/pago");
app.use("/pagos", pagosRoutes);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor  escuchando en http://localhost:${port}`);
});
