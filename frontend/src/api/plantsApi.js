import axios from 'axios';

const API_URL = 'http://localhost:4000/api/plants';

// 1. Obtener plantas
export const fetchPlantsRequest = async (headers) => {
    return await axios.get(API_URL, { headers });
};

// 2. Añadir planta
export const createPlantRequest = async (plantData, headers) => {
    return await axios.post(API_URL, plantData, { headers });
};

// 3. Eliminar planta
export const deletePlantRequest = async (id, headers) => {
    return await axios.delete(`${API_URL}/${id}`, { headers });
};

// 4. Regar planta
export const waterPlantRequest = async (id, data, headers) => {
    return await axios.put(`${API_URL}/${id}/water`, data, { headers });
};