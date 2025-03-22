const admin = require("../config/config");

// Accedemos a Firestore
const db = admin.firestore();
const collection = db.collection("usuarios");

class User {
  // Obtener todos los usuarios
  static async getAllUsers() {
    const snapshot = await collection.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
  
  // Obtener un usuario por ID
  static async getUserById(id) {
    const doc = await collection.doc(id).get();
    if (!doc.exists) throw new Error("Usuario no encontrado");
    return { id: doc.id, ...doc.data() };
  }

  // Crear un nuevo usuario
  static async createUser(userData) {
    const docRef = await collection.add(userData);
    return { id: docRef.id, ...userData };
  }

  // Actualizar un usuario existente
  static async updateUser(id, updatedData) {
    await collection.doc(id).update(updatedData);
    return { id, ...updatedData };
  }

  // Eliminar un usuario
  static async deleteUser(id) {
    await collection.doc(id).delete();
    return { id, message: "Usuario eliminado" };
  }
}

module.exports = User;