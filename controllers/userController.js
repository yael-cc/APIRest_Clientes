const User = require("../models/user");
const crypto = require("crypto");

class UserController {
  // Expresión regular para validar el formato del correo electrónico
  static emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Obtener todos los usuarios
  static async getUsers(req, res) {
    try {
      const users = await User.getAllUsers();
      if (!users.length) {
        return res.status(404).json({ message: "No hay usuarios registrados." });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error al obtener los usuarios",
        error: error.message
      });
    }
  }

  // Obtener un usuario por su ID
  static async getUserById(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "El ID del usuario es requerido." });
    }

    try {
      const user = await User.getUserById(id);  // Buscar usuario por ID en el modelo
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      res.status(200).json(user);  // Si se encuentra el usuario, devolverlo
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error al obtener el usuario",
        error: error.message
      });
    }
  }

  // Método para crear un nuevo usuario
  static async createUser(req, res) {
    const { name, email, password } = req.body;

    // Validaciones para asegurar que los campos necesarios están presentes
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan datos requeridos (name, email, password)." });
    }

    // Validación del correo electrónico
    if (!UserController.emailRegex.test(email)) {
      return res.status(400).json({ message: "El correo electrónico no es válido." });
    }

    // Validación de la longitud de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    try {
      // Verificar si el usuario ya existe (basado en el email)
      const existingUser = await User.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El usuario con este correo ya existe." });
      }

      // Generar un bearerToken aleatorio
      const bearerToken = crypto.randomBytes(32).toString("hex");

      // Crear el nuevo usuario con el bearerToken
      const newUser = await User.createUser({ name, email, password, bearerToken });
      res.status(201).json({
        message: "Usuario creado exitosamente.",
        user: newUser
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error al crear el usuario",
        error: error.message
      });
    }
  }

  // Método para actualizar completamente un usuario (PUT)
  static async updateUser(req, res) {
    const eventData = req.body;
    
    // Buscar el usuario actual en la base de datos usando el ID
    const existingUser = await User.getUserById(req.params.id);

    // Verificar si el usuario existe.
    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el token es parte de los datos enviados y si existe un intento de modificarlo
    if (eventData.bearerToken) {
      return res.status(400).json({
        message: "No puedes modificar el Bearer Token",
      });
    }

    // Validación del correo electrónico si se intenta actualizar
    if (eventData.email && !UserController.emailRegex.test(eventData.email)) {
      return res.status(400).json({ message: "El correo electrónico no es válido." });
    }

    // Validación de la contraseña si se intenta actualizar
    if (eventData.password && eventData.password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    try {
      // Actualizar todos los campos con los datos enviados (sin el bearerToken)
      const updatedUser = {
        name: eventData.name || existingUser.name,
        email: eventData.email || existingUser.email,
        password: eventData.password || existingUser.password,
        token: existingUser.token, // El token no se debe modificar
      };

      // Actualizamos el usuario
      await User.updateUser(req.params.id, updatedUser);

      return res.status(200).json({
        message: "Usuario actualizado correctamente",
        updatedUser,
      });
    } catch (error) {
      return res.status(400).json({
        message: "No se pudo actualizar el usuario",
      });
    }
  }

  // Método para actualizar parcialmente un usuario (PATCH)
  static async patchUser(req, res) {
    const eventData = req.body;

    // Buscar el usuario actual en la base de datos usando el ID
    const existingUser = await User.getUserById(req.params.id);

    // Verificar si el usuario existe.
    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el token es parte de los datos enviados y si existe un intento de modificarlo
    if (eventData.bearerToken) {
      return res.status(400).json({
        message: "No puedes modificar el Bearer Token",
      });
    }

    // Filtrar solo los campos que se desean actualizar
    const updatedData = {};

    if (eventData.name) updatedData.name = eventData.name;
    if (eventData.email) updatedData.email = eventData.email;
    if (eventData.password) updatedData.password = eventData.password;

    // Validación del correo electrónico si se intenta actualizar
    if (updatedData.email && !UserController.emailRegex.test(updatedData.email)) {
      return res.status(400).json({ message: "El correo electrónico no es válido." });
    }

    // Validación de la contraseña si se intenta actualizar
    if (updatedData.password && updatedData.password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    // Si no se envían datos para actualizar, devolvemos un mensaje de error
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        message: "No se proporcionaron datos para actualizar.",
      });
    }

    try {
      // Actualizar solo los campos enviados (sin tocar el bearerToken)
      await User.updateUser(req.params.id, updatedData);

      return res.status(200).json({
        message: "Usuario actualizado parcialmente",
        updatedUser: { id: req.params.id, ...updatedData },
      });
    } catch (error) {
      return res.status(400).json({
        message: "No se pudo actualizar el usuario",
      });
    }
  }

  // Eliminar un usuario
  static async deleteUser(req, res) {
    try {
      await User.deleteUser(req.params.id);
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(400).json({ message: "No se pudo eliminar el usuario" });
    }
  }
}

module.exports = UserController;