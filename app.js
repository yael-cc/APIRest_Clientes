const express = require("express");
const app = express();
require("dotenv").config(); // Cargar variables de entorno

// Importamos las rutas de usuarios
const userRoutes = require("./routes/userRoutes");

// Middleware para parsear JSON en las solicitudes
app.use(express.json());

// Definimos la ruta base para la API de usuarios
app.use("/api/users", userRoutes);

// Definimos el puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});