const axios = require('axios');
const URL_base = 'https://apirest-clientes.onrender.com/api/clients';

// Obtener todos los clientes del usuario autenticado
const getClients = async (token) => {
  try {
    const response = await axios.get(URL_base, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Clientes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los clientes:', error.response?.data || error.message);
  }
};

// Obtener un cliente por ID del usuario autenticado
const getClientById = async (id, token) => {
  try {
    const URL = `${URL_base}/${id}`;
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Cliente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el cliente:', error.response?.data || error.message);
  }
};

// Crear un nuevo cliente para el usuario autenticado
const createClient = async (clientData, token) => {
  try {
    const response = await axios.post(URL_base, clientData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Cliente creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el cliente:', error.response?.data || error.message);
  }
};

// Actualizar un cliente para el usuario autenticado
const updateClient = async (id, clientData, token) => {
  try {
    const URL = `${URL_base}/${id}`;
    const response = await axios.put(URL, clientData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Cliente actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el cliente:', error.response?.data || error.message);
  }
};

// Actualizar parcialmente un cliente para el usuario autenticado
const patchClient = async (id, updateData, token) => {
  try {
    const URL = `${URL_base}/${id}`;
    const response = await axios.patch(URL, updateData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Cliente actualizado parcialmente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar parcialmente el cliente:', error.response?.data || error.message);
  }
};

// Eliminar un cliente para el usuario autenticado
const deleteClient = async (id, token) => {
  try {
    const URL = `${URL_base}/${id}`;
    const response = await axios.delete(URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Cliente eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el cliente:', error.response?.data || error.message);
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  patchClient,
  deleteClient
};