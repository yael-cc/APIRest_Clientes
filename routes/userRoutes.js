const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Rutas para gestionar usuarios
router.get("/", userController.getUsers); // Obtener todos los usuarios
router.get("/:id", userController.getUserById); // Obtener un usuario por ID
router.post("/", userController.createUser); // Crear un usuario
router.put("/:id", userController.updateUser); // Actualizar completamente un usuario
router.patch("/:id", userController.patchUser); // Actualizar parcialmente un usuario
router.delete("/:id", userController.deleteUser); // Eliminar un usuario

module.exports = router;