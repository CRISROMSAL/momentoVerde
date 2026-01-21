import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [plants, setPlants] = useState([]);
    const [newPlant, setNewPlant] = useState({ 
        name: '', 
        species: '', 
        wateringFrequency: '', 
        lastWatered: '' // Nuevo campo
    });

    // --- Lógica de carga y borrado se mantiene igual ---
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await axios.get('http://localhost:4000/api/plants', {
                    headers: { 'x-auth-token': token }
                });
                setPlants(res.data);
            } catch (err) { console.error(err); }
        };
        fetchPlants();
    }, []);

    const handleAddPlant = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:4000/api/plants', newPlant, {
                headers: { 'x-auth-token': token }
            });
            setPlants([...plants, res.data]);
            setNewPlant({ name: '', species: '', wateringFrequency: '', lastWatered: '' });
        } catch (err) { alert('Error al añadir'); }
    };

    // FUNCIÓN PARA CALCULAR EL PRÓXIMO RIEGO
    const calculateNextWatering = (lastDate, frequency) => {
        const date = new Date(lastDate);
        date.setDate(date.getDate() + parseInt(frequency));
        return date.toLocaleDateString(); // Devuelve la fecha bonita (dd/mm/aaaa)
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Mis Plantas 🌿</h2>
            
            <form onSubmit={handleAddPlant} style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
                <h3>Añadir Nueva Planta</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" placeholder="Nombre" value={newPlant.name} onChange={e => setNewPlant({...newPlant, name: e.target.value})} required />
                    <input type="text" placeholder="Especie" value={newPlant.species} onChange={e => setNewPlant({...newPlant, species: e.target.value})} />
                    <input type="number" placeholder="¿Cada cuántos días lo riegas?" min="1" value={newPlant.wateringFrequency} onChange={e => setNewPlant({...newPlant, wateringFrequency: e.target.value})} required />
                    
                    {/* INPUT DE CALENDARIO */}
                    <label>¿Cuándo la regaste por última vez?</label>
                    <input type="date" value={newPlant.lastWatered} onChange={e => setNewPlant({...newPlant, lastWatered: e.target.value})} required />
                    
                    <button type="submit" style={{ background: '#4CAF50', color: 'white', padding: '10px' }}>Añadir Planta</button>
                </div>
            </form>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {plants.map(plant => (
                    <li key={plant._id} style={{ border: '1px solid #ddd', margin: '15px 0', padding: '15px', borderRadius: '8px' }}>
                        <strong>{plant.name}</strong> - {plant.species}
                        <br />
                        <span>💧 Riego cada {plant.wateringFrequency} días</span>
                        <br />
                        <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                            📅 Próximo riego: {calculateNextWatering(plant.lastWatered, plant.wateringFrequency)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;