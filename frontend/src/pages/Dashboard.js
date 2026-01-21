import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [plants, setPlants] = useState([]);
    const [newPlant, setNewPlant] = useState({ 
        name: '', 
        species: '', 
        wateringFrequency: '', 
        lastWatered: '',
        image: '' 
    });

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewPlant({ ...newPlant, image: reader.result });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleAddPlant = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:4000/api/plants', newPlant, {
                headers: { 'x-auth-token': token }
            });
            setPlants([...plants, res.data]);
            setNewPlant({ name: '', species: '', wateringFrequency: '', lastWatered: '', image: '' });
            alert('¡Planta añadida con éxito!');
        } catch (err) { alert('Error al añadir'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta planta?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/plants/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setPlants(plants.filter(plant => plant._id !== id));
        } catch (err) { alert('Error al eliminar'); }
    };

    // --- NUEVAS FUNCIONES DE RIEGO ---

    const handleWatering = async (id, customDate = null) => {
        try {
            const token = localStorage.getItem('token');
            const dateToSave = customDate || new Date().toISOString().split('T')[0];
            
            const res = await axios.put(`http://localhost:4000/api/plants/${id}/water`, 
                { lastWatered: dateToSave },
                { headers: { 'x-auth-token': token } }
            );

            setPlants(plants.map(p => p._id === id ? res.data : p));
            alert('¡Riego registrado!');
        } catch (err) {
            alert('Error al registrar el riego');
        }
    };

    const getWateringStatus = (lastDate, frequency) => {
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + parseInt(frequency));
        
        const today = new Date();
        today.setHours(0,0,0,0);
        nextDate.setHours(0,0,0,0);

        if (today.getTime() === nextDate.getTime()) return 'TODAY';
        if (today > nextDate) return 'OVERDUE';
        return 'FUTURE';
    };

    const calculateNextWatering = (lastDate, frequency) => {
        const date = new Date(lastDate);
        date.setDate(date.getDate() + parseInt(frequency));
        return date.toLocaleDateString();
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Mis Plantas 🌿</h2>
                <button onClick={logout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                    Cerrar Sesión
                </button>
            </div>
            
            <form onSubmit={handleAddPlant} style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '10px' }}>
                <h3>Añadir Nueva Planta</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" placeholder="Nombre" value={newPlant.name} onChange={e => setNewPlant({...newPlant, name: e.target.value})} required />
                    <input type="text" placeholder="Especie" value={newPlant.species} onChange={e => setNewPlant({...newPlant, species: e.target.value})} />
                    <input type="number" placeholder="¿Cada cuántos días lo riegas?" min="1" value={newPlant.wateringFrequency} onChange={e => setNewPlant({...newPlant, wateringFrequency: e.target.value})} required />
                    
                    <label>¿Cuándo la regaste por última vez?</label>
                    <input type="date" value={newPlant.lastWatered} onChange={e => setNewPlant({...newPlant, lastWatered: e.target.value})} required />
                    
                    <label>¿Quieres añadir una foto de tu planta?</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: '10px' }} />
                    
                    {newPlant.image && <img src={newPlant.image} alt="preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />}
                    
                    <button type="submit" style={{ background: '#4CAF50', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Añadir Planta
                    </button>
                </div>
            </form>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {plants.map(plant => {
                    const status = getWateringStatus(plant.lastWatered, plant.wateringFrequency);
                    const nextDateStr = calculateNextWatering(plant.lastWatered, plant.wateringFrequency);

                    return (
                        <li key={plant._id} style={{ border: '1px solid #ddd', margin: '15px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '15px', alignItems: 'center', background: 'white' }}>
                            
                            {plant.image && (
                                <img src={plant.image} alt={plant.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
                            )}
                            
                            <div style={{ flex: 1 }}>
                                <strong style={{ fontSize: '1.2em' }}>{plant.name}</strong> - {plant.species}
                                <br />
                                <span>💧 Riego cada {plant.wateringFrequency} días</span>
                                <br />
                                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                    📅 Próximo riego: {nextDateStr}
                                </span>

                                <div style={{ marginTop: '10px' }}>
                                    {status === 'TODAY' && (
                                        <button onClick={() => handleWatering(plant._id)} style={{ background: '#2196F3', color: 'white', padding: '8px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                                            💧 ¡Toca regar hoy! (Confirmar)
                                        </button>
                                    )}

                                    {status === 'OVERDUE' && (
                                        <div style={{ background: '#ffebee', padding: '10px', borderRadius: '5px', border: '1px solid #ffcdd2' }}>
                                            <p style={{ color: '#d32f2f', margin: '0 0 10px 0', fontWeight: 'bold' }}>⚠️ ¡A falta de regar!</p>
                                            <input type="date" id={`date-${plant._id}`} defaultValue={new Date().toISOString().split('T')[0]} style={{ padding: '5px' }} />
                                            <button onClick={() => {
                                                const selectedDate = document.getElementById(`date-${plant._id}`).value;
                                                handleWatering(plant._id, selectedDate);
                                            }} style={{ marginLeft: '10px', background: '#d32f2f', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                                                Registrar Riego
                                            </button>
                                        </div>
                                    )}

                                    {status === 'FUTURE' && (
                                        <span style={{ color: '#666', fontSize: '0.9em', fontStyle: 'italic' }}>Aún no toca regar</span>
                                    )}
                                </div>
                            </div>

                            <button onClick={() => handleDelete(plant._id)} style={{ background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', alignSelf: 'flex-start' }}>
                                Eliminar
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Dashboard;