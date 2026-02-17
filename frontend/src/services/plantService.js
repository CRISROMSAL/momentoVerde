import * as plantsApi from '../api/plantsApi';

// Función auxiliar para crear el header con el token
const getHeaders = (token) => ({ 'x-auth-token': token });

export const fetchAllPlants = (token) => {
    return plantsApi.getPlantsRequest(getHeaders(token));
};

export const addNewPlant = (plantData, token) => {
    return plantsApi.createPlantRequest(plantData, getHeaders(token));
};

export const removePlant = (id, token) => {
    return plantsApi.deletePlantRequest(id, getHeaders(token));
};

export const registerWatering = (id, date, token) => {
    const data = { lastWatered: date };
    return plantsApi.updateWateringRequest(id, data, getHeaders(token));
};