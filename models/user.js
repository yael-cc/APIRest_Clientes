const admin = require("../config/config");

// Accedemos a Firestore
const db = admin.firestore();
const collection = db.collection("usuarios");

class User {
  // Método para transformar un documento de Firestore a un objeto JavaScript
  static _transformDocument(doc) {
    if (!doc.exists) throw new Error("Documento no encontrado");
    return { id: doc.id, ...doc.data() };
  }

  // Obtener todos los usuarios
  static async getAllUsers() {
    try {
      const snapshot = await collection.get();
      if (snapshot.empty) return []; // Si no hay usuarios, devolver un array vacío
      return snapshot.docs.map((doc) => this._transformDocument(doc));
    } catch (error) {
      console.error("Error en getAllUsers:", error);
      throw new Error("Error al obtener los usuarios");
    }
  }

  // Obtener un usuario por ID
  static async getUserById(id) {
    try {
      const doc = await collection.doc(id).get();
      if (!doc.exists) {
        return null; // Si no existe, devolver null
      }
      return this._transformDocument(doc); // Transformar y devolver el documento si existe
    } catch (error) {
      console.error("Error en getUserById:", error);
      return null; // Devolver null en caso de error para no romper el flujo
    }
  }


  // Crear un nuevo usuario
  static async createUser(userData) {
    try {
      // Validar que los datos del usuario estén completos
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error("Faltan datos requeridos (name, email, password).");
      }

      const docRef = await collection.add(userData);
      return { id: docRef.id, ...userData };
    } catch (error) {
      console.error("Error en createUser:", error);
      throw new Error("Error al crear el usuario");
    }
  }

  // Actualizar un usuario existente
  static async updateUser(id, updatedData) {
    try {
      // Validar que el ID y los datos a actualizar estén presentes
      if (!id || !updatedData || typeof updatedData !== "object") {
        throw new Error("Datos de actualización inválidos.");
      }

      // Actualizamos el documento en Firestore con los datos proporcionados
      await collection.doc(id).update(updatedData);

      return { id, ...updatedData }; // Devolvemos el id y los datos actualizados
    } catch (error) {
      console.error("Error en updateUser:", error);
      throw new Error("Error al actualizar el usuario");
    }
  }


  // Eliminar un usuario
  static async deleteUser(id) {
    try {
      // Validar que el ID esté presente
      if (!id) {
        throw new Error("El ID del usuario es requerido.");
      }

      await collection.doc(id).delete();
      return { id, message: "Usuario eliminado correctamente." };
    } catch (error) {
      console.error("Error en deleteUser:", error);
      throw new Error("Error al eliminar el usuario");
    }
  }

  // Obtener un usuario por email
  static async getUserByEmail(email) {
    try {
      // Validar que el email esté presente
      if (!email) {
        throw new Error("El email es requerido.");
      }

      const snapshot = await collection.where("email", "==", email).get();
      if (snapshot.empty) return null; // No se encontró el usuario

      // Devuelve el primer usuario encontrado
      return this._transformDocument(snapshot.docs[0]);
    } catch (error) {
      console.error("Error en getUserByEmail:", error);
      throw new Error("Error al buscar usuario por email");
    }
  }
}

module.exports = User;