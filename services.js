const axios = require('axios');

const getUsers = async (params = null) => {
  try {
    const url = 'http://localhost:3000/api/users';
    const response = params 
      ? await axios.get(url, { params }) 
      : await axios.get(url);
    
    console.log('Usuarios:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.response?.data || error.message);
  }
};

const getUserById = async (id) => {
  try {
    const url = `http://localhost:3000/api/users/${id}`;
    const response = await axios.get(url);
    
    console.log('Usuario:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario:', error.response?.data || error.message);
  }
};


const createUser = async (userData) => {
  try {
    const url = 'http://localhost:3000/api/users';
    const response = await axios.post(url, userData);  // Mandando el JSON completo como body
    
    console.log('Usuario creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el usuario:', error.response?.data || error.message);
  }
};


const updateUser = async (id, userData) => {
  try {
    const url = `http://localhost:3000/api/users/${id}`;
    const response = await axios.put(url, userData);  // Mandando el JSON completo como body
    
    console.log('Usuario actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.response?.data || error.message);
  }
};


const patchUser = async (id, updateData) => {
  try {
    const url = `http://localhost:3000/api/users/${id}`;
    const response = await axios.patch(url, updateData);
    
    console.log('Usuario actualizado parcialmente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar parcialmente el usuario:', error.response?.data || error.message);
  }
};


const deleteUser = async (id) => {
  try {
    const url = `http://localhost:3000/api/users/${id}`;
    const response = await axios.delete(url);
    
    console.log('Usuario eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.response?.data || error.message);
  }
};


