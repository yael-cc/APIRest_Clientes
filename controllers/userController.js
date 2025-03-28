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

      // Si el usuario no se encuentra, devolver 404
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      // Si el usuario se encuentra, devolverlo
      res.status(200).json(user);
      
    } catch (error) {
      // En caso de error al interactuar con la base de datos, devolver 500
      console.error("Error al obtener el usuario:", error);
      res.status(500).json({
        message: "Error al obtener el usuario",
        error: error.message
      });
    }
  }

  // Método para crear un nuevo usuario
  static async createUser(req, res) {
    const { name, email, password } = req.body;

    // Verificar si el `body` es un objeto válido
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "El cuerpo de la petición debe ser un JSON válido." });
    }

    // Verificar tipos de datos
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Los datos enviados deben ser de tipo string." });
    }

    // Verificar que la cadena no se encuentre vacia.
    if (!name.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({ message: "Los campos no pueden estar vacíos." });
    }  
    
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

    // Verificar si el `body` es un objeto válido
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "El cuerpo de la petición debe ser un JSON válido." });
    }

    try {
      // Buscar el usuario actual en la base de datos usando el ID
      const existingUser = await User.getUserById(req.params.id);

      // Verificar si el usuario existe.
      if (!existingUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Filtrar solo los campos que se desean actualizar
      const updatedUser = {};

      if (eventData.name) updatedUser.name = eventData.name;
      if (eventData.email) updatedUser.email = eventData.email;
      if (eventData.password) updatedUser.password = eventData.password;

      // Asegurarse de no incluir el `token` en la actualización, solo si ya existe.
      if (existingUser.token) {
        updatedUser.token = existingUser.token; // No modificar el token
      }

      // Verificar tipos de datos
      if (updatedUser.name && typeof updatedUser.name !== "string") {
        return res.status(400).json({ message: "El nombre debe ser una cadena de texto." });
      }
      
      if (updatedUser.email && typeof updatedUser.email !== "string") {
          return res.status(400).json({ message: "El email debe ser una cadena de texto." });
      }
      
      if (updatedUser.password && typeof updatedUser.password !== "string") {
          return res.status(400).json({ message: "La contraseña debe ser una cadena de texto." });
      }

      // Verificar que la cadena no se encuentre vacia.
      if (!updatedUser.name.trim() || !updatedUser.email.trim() || !updatedUser.password.trim()) {
        return res.status(400).json({ message: "Los campos no pueden estar vacíos." });
      }  

      // Validación del correo electrónico si se intenta actualizar
      if (updatedUser.email && !UserController.emailRegex.test(updatedUser.email)) {
        return res.status(400).json({ message: "El correo electrónico no es válido." });
      }

      // Validación de la contraseña si se intenta actualizar
      if (updatedUser.password && updatedUser.password.length < 6) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
      }

      // Si no se envían datos para actualizar, devolvemos un mensaje de error
      if (Object.keys(updatedUser).length === 0) {
        return res.status(400).json({
          message: "No se proporcionaron datos para actualizar.",
        });
      }

      // Ahora pasamos los datos correctamente a la función de actualización
      await User.updateUser(req.params.id, updatedUser);

      return res.status(200).json({
        message: "Usuario actualizado correctamente",
        updatedUser: { id: req.params.id, ...updatedUser },
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

    // Verificar si el `body` es un objeto válido
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "El cuerpo de la petición debe ser un JSON válido." });
    }
    
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

    // Verificar tipos de datos
    if (updatedUser.name && typeof updatedUser.name !== "string") {
      return res.status(400).json({ message: "El nombre debe ser una cadena de texto." });
    }
    
    if (updatedUser.email && typeof updatedUser.email !== "string") {
        return res.status(400).json({ message: "El email debe ser una cadena de texto." });
    }
    
    if (updatedUser.password && typeof updatedUser.password !== "string") {
        return res.status(400).json({ message: "La contraseña debe ser una cadena de texto." });
    }

    // Verificar que la cadena no se encuentre vacia.
    if (!updatedUser.name.trim() || !updatedUser.email.trim() || !updatedUser.password.trim()) {
      return res.status(400).json({ message: "Los campos no pueden estar vacíos." });
    }  

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
      // Si el error es de usuario no encontrado, manejalo específicamente
      if (error.message === "Usuario no encontrado") {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      // Otros errores de actualización
      return res.status(500).json({
        message: "No se pudo actualizar el usuario",
        error: error.message,
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