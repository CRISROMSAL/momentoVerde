import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    // ESTADOS
    const [plants, setPlants] = useState([]);
    const [newPlant, setNewPlant] = useState({ 
        name: '', 
        species: '', 
        wateringFrequency: '', 
        lastWatered: '',
        image: '' 
    });

    // 1. CARGAR PLANTAS AL INICIAR
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const token = localStorage.getItem('token');
                // Si no hay token, no intentamos la petición (evita el error 401 en consola)
                if (!token) return;

                const res = await axios.get('http://localhost:4000/api/plants', {
                    headers: { 'x-auth-token': token }
                });
                setPlants(res.data);
            } catch (err) {
                console.error("Error al cargar plantas:", err);
            }
        };
        fetchPlants();
    }, []);

    // 2. MANEJO DE IMAGEN (Convertir a Base64)
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

    // 3. AÑADIR NUEVA PLANTA
    const handleAddPlant = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:4000/api/plants', newPlant, {
                headers: { 'x-auth-token': token }
            });
            setPlants([...plants, res.data]);
            // Limpiar formulario
            setNewPlant({ name: '', species: '', wateringFrequency: '', lastWatered: '', image: '' });
            alert('¡Planta añadida con éxito! 🌿');
        } catch (err) {
            console.error(err);
            alert('Error al añadir la planta');
        }
    };

    // 4. ELIMINAR PLANTA
    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta planta?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/plants/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setPlants(plants.filter(plant => plant._id !== id));
        } catch (err) {
            alert('Error al eliminar');
        }
    };

    // 5. REGISTRAR RIEGO (PUT)
    const handleWatering = async (id, customDate = null) => {
    try {
        const token = localStorage.getItem('token');
        // Usamos la fecha seleccionada o la de hoy
        const dateToSave = customDate || new Date().toISOString().split('T')[0];
        
        console.log("Enviando riego para ID:", id, "Fecha:", dateToSave);

        const res = await axios.put(`http://localhost:4000/api/plants/${id}/water`, 
            { lastWatered: dateToSave },
            { headers: { 'x-auth-token': token } }
        );

        console.log("Respuesta del servidor:", res.data);

        // ACTUALIZACIÓN MANUAL FORZADA:
        // Si el servidor (res.data) no trae la fecha nueva, la ponemos nosotros a mano
        setPlants(prevPlants => 
            prevPlants.map(p => {
                if (p._id === id) {
                    // Combinamos los datos antiguos con la nueva fecha de riego
                    return { ...p, lastWatered: dateToSave };
                }
                return p;
            })
        );

        alert('¡Riego registrado! 💧');

    } catch (err) {
        console.error("Error completo:", err);
        alert('Error al registrar el riego. Revisa la consola (F12)');
    }
};

    // 6. LÓGICA DE FECHAS Y ESTADOS
    const getWateringStatus = (lastDate, frequency) => {
    // 1. Creamos la fecha del último riego (forzando mediodía para evitar errores de zona horaria)
    const last = new Date(lastDate);
    last.setHours(12, 0, 0, 0);

    // 2. Calculamos el próximo riego sumando los días
    const nextDate = new Date(last);
    nextDate.setDate(last.getDate() + parseInt(frequency));
    nextDate.setHours(12, 0, 0, 0);

    // 3. Obtenemos el "hoy" a mediodía
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    // COMPARACIÓN
    if (today.getTime() === nextDate.getTime()) return 'TODAY';
    if (today.getTime() > nextDate.getTime()) return 'OVERDUE';
    return 'FUTURE';
};

const calculateNextWatering = (lastDate, frequency) => {
    const date = new Date(lastDate);
    // Ajuste para que no se mueva de día por la zona horaria
    date.setHours(date.getHours() + 12);
    
    date.setDate(date.getDate() + parseInt(frequency));
    return date.toLocaleDateString();
};

    // 7. CERRAR SESIÓN
    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            {/* CABECERA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ color: '#2e7d32' }}>Mis Plantas 🌿</h1>
                <button onClick={logout} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Cerrar Sesión
                </button>
            </div>
            
            {/* FORMULARIO DE ALTA */}
            <form onSubmit={handleAddPlant} style={{ marginBottom: '30px', padding: '20px', background: '#f9f9f9', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0 }}>Añadir Nueva Planta</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input type="text" placeholder="Nombre (ej: Manolo)" value={newPlant.name} onChange={e => setNewPlant({...newPlant, name: e.target.value})} required style={{ padding: '8px' }} />
                    <input type="text" placeholder="Especie (ej: Cactus)" value={newPlant.species} onChange={e => setNewPlant({...newPlant, species: e.target.value})} style={{ padding: '8px' }} />
                    <input type="number" placeholder="Frecuencia de riego (días)" min="1" value={newPlant.wateringFrequency} onChange={e => setNewPlant({...newPlant, wateringFrequency: e.target.value})} required style={{ padding: '8px' }} />
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Último riego:</label>
                        <input type="date" value={newPlant.lastWatered} onChange={e => setNewPlant({...newPlant, lastWatered: e.target.value})} required style={{ padding: '8px', width: '100%', boxSizing: 'border-box' }} />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em' }}>Foto de la planta:</label>
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                    
                    {newPlant.image && (
                        <img src={newPlant.image} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    )}
                    
                    <button type="submit" style={{ background: '#4CAF50', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        + Añadir a mi colección
                    </button>
                </div>
            </form>

            <hr style={{ border: '0', borderTop: '1px solid #eee', marginBottom: '30px' }} />

            {/* LISTADO DE PLANTAS CON LÓGICA CONDICIONAL */}
            {plants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#f0f4f0', borderRadius: '10px', color: '#666' }}>
                    <p style={{ fontSize: '1.2em', margin: 0 }}>Tu jardín está vacío. 🌵</p>
                    <p>¡Usa el formulario de arriba para añadir tu primera planta!</p>
                </div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {plants.map(plant => {
                        const status = getWateringStatus(plant.lastWatered, plant.wateringFrequency);
                        const nextDateStr = calculateNextWatering(plant.lastWatered, plant.wateringFrequency);

                        return (
                            <li key={plant._id} style={{ border: '1px solid #ddd', marginBottom: '20px', padding: '15px', borderRadius: '10px', display: 'flex', gap: '20px', alignItems: 'center', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                
                                {plant.image ? (
                                    <img src={plant.image} alt={plant.name} style={{ width: '110px', height: '110px', objectFit: 'cover', borderRadius: '10px' }} />
                                ) : (
                                    <div style={{ width: '110px', height: '110px', background: '#eee', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>Sin foto</div>
                                )}
                                
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{plant.name} <span style={{ fontWeight: 'normal', fontSize: '0.8em', color: '#777' }}>({plant.species})</span></h3>
                                    <p style={{ margin: '5px 0', fontSize: '0.9em' }}>💧 Riego: cada {plant.wateringFrequency} días</p>
                                    <p style={{ margin: '5px 0', color: '#2e7d32', fontWeight: 'bold' }}>📅 Próximo: {nextDateStr}</p>

                                    <div style={{ marginTop: '12px' }}>
                                        {/* BOTONES SEGÚN ESTADO */}
                                        {status === 'TODAY' && (
    <button 
        key={`btn-today-${plant._id}`} 
        onClick={() => handleWatering(plant._id)} 
        style={{ background: '#2196F3', color: 'white', padding: '8px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
    >
        🚿 ¡Toca regar hoy!
    </button>
)}

                                        {status === 'OVERDUE' && (
                                            <div style={{ background: '#ffebee', padding: '10px', borderRadius: '8px', border: '1px solid #ffcdd2' }}>
                                                <p style={{ color: '#d32f2f', margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '0.9em' }}>⚠️ ¡Se te ha pasado el riego!</p>
                                                <input type="date" id={`date-${plant._id}`} defaultValue={new Date().toISOString().split('T')[0]} style={{ padding: '4px' }} />
                                                <button onClick={() => {
                                                    const selectedDate = document.getElementById(`date-${plant._id}`).value;
                                                    handleWatering(plant._id, selectedDate);
                                                }} style={{ marginLeft: '8px', background: '#d32f2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                                                    Regar ahora
                                                </button>
                                            </div>
                                        )}

                                        {status === 'FUTURE' && (
                                            <span style={{ color: '#777', fontSize: '0.85em', fontStyle: 'italic' }}>✅ Está bien hidratada</span>
                                        )}
                                    </div>
                                </div>

                                <button onClick={() => handleDelete(plant._id)} style={{ background: 'none', border: '1px solid #ff4d4d', color: '#ff4d4d', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', alignSelf: 'flex-start', fontSize: '0.8em' }}>
                                    Eliminar
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;