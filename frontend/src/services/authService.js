import * as authApi from '../api/authApi';

// Servicio para Login
export const loginUser = (credentials) => {
    return authApi.loginRequest(credentials);
};

// Servicio para Registro
export const registerUser = (userData) => {
    return authApi.registerRequest(userData);
};