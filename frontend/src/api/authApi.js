import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

// Petición para Login
export const loginRequest = async (userCredentials) => {
    return await axios.post(`${API_URL}/login`, userCredentials);
};

// Petición para Registro (La dejamos lista para cuando hagas el Register)
export const registerRequest = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};