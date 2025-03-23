const axios = require('axios');
const URL_base = 'http://localhost:3000/api/users';

const getUsers = async (params = null) => {
  try {
    const response = params 
      ? await axios.get(URL_base, { params }) 
      : await axios.get(URL_base);
    
    console.log('Usuarios:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error.response?.data || error.message);
  }
};

const getUserById = async (id) => {
  try {
    const URL = URL_base+`/${id}`;
    const response = await axios.get(URL);
    
    console.log('Usuario:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el usuario:', error.response?.data || error.message);
  }
};


const createUser = async (userData) => {
  try {
    const response = await axios.post(URL_base, userData);  // Mandando el JSON completo como body
    
    console.log('Usuario creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el usuario:', error.response?.data || error.message);
  }
};


const updateUser = async (id, userData) => {
  try {
    const URL = URL_base+`/${id}`;
    const response = await axios.put(URL, userData);  // Mandando el JSON completo como body
    
    console.log('Usuario actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error.response?.data || error.message);
  }
};


const patchUser = async (id, updateData) => {
  try {
    const URL = URL_base+ `/${id}`;
    const response = await axios.patch(URL, updateData);
    
    console.log('Usuario actualizado parcialmente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar parcialmente el usuario:', error.response?.data || error.message);
  }
};


const deleteUser = async (id) => {
  try {
    const URL = URL_base + `/${id}`;
    const response = await axios.delete(URL);
    
    console.log('Usuario eliminado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error.response?.data || error.message);
  }
};


