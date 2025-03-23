const User = require("../models/user");
const { v4: uuidv4 } = require("uuid"); // Para generar IDs únicos

class ClientController {
  // Obtener todos los clientes del usuario autenticado
  static async getAllClients(req, res) {
    const bearerToken = req.headers.authorization?.split(" ")[1];

    if (!bearerToken) {
        return res.status(401).json({ message: "No autorizado, token requerido." });
    }

    try {
        const user = await User.getUserByToken(bearerToken);
        if (!user) {
        return res.status(401).json({ message: "Token inválido o usuario no encontrado." });
        }

        res.status(200).json(user.clientes || []);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes." });
        }
    }

    // Obtener un cliente por ID
    static async getClientById(req, res) {
    const bearerToken = req.headers.authorization?.split(" ")[1];
  
    if (!bearerToken) {
      return res.status(401).json({ message: "No autorizado, token requerido." });
    }
  
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "El ID del cliente es requerido." });
    }
  
    try {
      // Obtener el usuario asociado al token
      const user = await User.getUserByToken(bearerToken);
      if (!user) {
        return res.status(401).json({ message: "Token inválido o usuario no encontrado." });
      }
  
      // Buscar el cliente por ID dentro del arreglo de clientes
      const client = user.clientes.find(client => client.id === id);
  
      if (!client) {
        return res.status(404).json({ message: "Cliente no encontrado." });
      }
  
      // Si se encuentra el cliente, devolver la información
      res.status(200).json(client);
    } catch (error) {
      console.error("Error al obtener el cliente:", error);
      res.status(500).json({ message: "Error al obtener el cliente." });
    }
  }  
  

  // Agregar un nuevo cliente al usuario autenticado
  static async createClient(req, res) {
    const bearerToken = req.headers.authorization?.split(" ")[1];

    if (!bearerToken) {
      return res.status(401).json({ message: "No autorizado, token requerido." });
    }

    const { name, email, address } = req.body;

    // Validaciones básicas
    if (!name || !email || !address || typeof address !== "object") {
      return res.status(400).json({ message: "Faltan datos requeridos o el formato es incorrecto." });
    }

    if (!address.city || !address.country || !address.municipality || !address.state) {
      return res.status(400).json({ message: "Los campos de dirección son obligatorios." });
    }

    try {
      const user = await User.getUserByToken(bearerToken);
      if (!user) {
        return res.status(401).json({ message: "Token inválido o usuario no encontrado." });
      }

      const newClient = {
        id: uuidv4(), // Generar un ID único
        name,
        email,
        address
      };

      user.clientes.push(newClient);
      await User.updateUser(user.id, { clientes: user.clientes });

      res.status(201).json({ message: "Cliente agregado exitosamente.", client: newClient });
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      res.status(500).json({ message: "Error al agregar cliente." });
    }
  }

  // Actualizar un cliente (PUT: reemplaza toda la información)
  static async updateClient(req, res) {
    const bearerToken = req.headers.authorization?.split(" ")[1];

    if (!bearerToken) {
      return res.status(401).json({ message: "No autorizado, token requerido." });
    }

    const { id } = req.params;
    const { name, email, address } = req.body;

    // Validar entrada
    if (!id || !name || !email || !address || typeof address !== "object") {
      return res.status(400).json({ message: "Datos incompletos o formato incorrecto." });
    }

    if (!address.city || !address.country || !address.municipality || !address.state) {
      return res.status(400).json({ message: "Todos los campos de dirección son obligatorios." });
    }

    try {
      const user = await User.getUserByToken(bearerToken);
      if (!user) {
        return res.status(401).json({ message: "Token inválido o usuario no encontrado." });
      }

      const clientIndex = user.clientes.findIndex(client => client.id === id);
      if (clientIndex === -1) {
        return res.status(404).json({ message: "Cliente no encontrado." });
      }

      // Reemplazar toda la información del cliente
      user.clientes[clientIndex] = { id, name, email, address };
      await User.updateUserClients(user.id, user.clientes);

      res.status(200).json({ message: "Cliente actualizado exitosamente." });
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      res.status(500).json({ message: "Error al actualizar cliente." });
    }
  }

  // Modificar un cliente parcialmente (PATCH)
  static async patchClient(req, res) {
    const bearerToken = req.headers.authorization?.split(" ")[1];

    if (!bearerToken) {
      return res.status(401).json({ message: "No autorizado, token requerido." });
    }

    const { id } = req.params;
    const { name, email, address } = req.body;

    if (!id) {
      return res.status(400).json({ message: "El ID del cliente es requerido." });
    }

    try {
      const user = await User.getUserByToken(bearerToken);
      if (!user) {
        return res.status(401).json({ message: "Token inválido o usuario no encontrado." });
      }

      const clientIndex = user.clientes.findIndex(client => client.id === id);
      if (clientIndex === -1) {
        return res.status(404).json({ message: "Cliente no encontrado." });
      }

      // Actualizar solo los campos enviados
      if (name) user.clientes[clientIndex].name = name;
      if (email) user.clientes[clientIndex].email = email;
      if (address) {
        user.clientes[clientIndex].address = {
          ...user.clientes[clientIndex].address,
          ...address
        };
      }

      await User.updateUserClients(user.id, user.clientes);

      res.status(200).json({ message: "Cliente actualizado parcialmente." });
    } catch (error) {
      console.error("Error al modificar cliente:", error);
      res.status(500).json({ message: "Error al modificar cliente." });
    }
  }

  // Eliminar un cliente
  static async deleteClient(req, res) {
    const bearerToken = req.headers.authorization?.split(" ")[1];

    if (!bearerToken) {
      return res.status(401).json({ message: "No autorizado, token requerido." });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "El ID del cliente es requerido." });
    }

    try {
      const user = await User.getUserByToken(bearerToken);
      if (!user) {
        return res.status(401).json({ message: "Token inválido o usuario no encontrado." });
      }

      const newClientsList = user.clientes.filter(client => client.id !== id);
      if (newClientsList.length === user.clientes.length) {
        return res.status(404).json({ message: "Cliente no encontrado." });
      }

      await User.updateUserClients(user.id, newClientsList);

      res.status(200).json({ message: "Cliente eliminado correctamente." });
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      res.status(500).json({ message: "Error al eliminar cliente." });
    }
  }

}

module.exports = ClientController;