import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // <-- YA NO LO USAMOS DIRECTAMENTE AQUÍ
import Swal from 'sweetalert2'; 
import '../App.css';

// IMPORTAMOS EL SERVICIO
import * as plantService from '../services/plantService';

const Dashboard = () => {
    
    const [plants, setPlants] = useState([]);
    const [newPlant, setNewPlant] = useState({ 
        name: '', 
        species: '', 
        wateringFrequency: '', 
        lastWatered: '',
        image: '' 
    });


    // Lógica desacoplada: Dashboard -> Service -> API
    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                
                // ANTES: const res = await axios.get(...)
                // AHORA: Llamamos al servicio
                const res = await plantService.fetchAllPlants(token);
                
                setPlants(res.data);
            } catch (err) { console.error("Error al cargar plantas:", err); }
        };
        fetchPlants();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewPlant({ ...newPlant, image: reader.result });
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleAddPlant = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // ANTES: const res = await axios.post(...)
            // AHORA: Llamamos al servicio
            const res = await plantService.addNewPlant(newPlant, token);

            setPlants([...plants, res.data]);
            setNewPlant({ name: '', species: '', wateringFrequency: '', lastWatered: '', image: '' });
            
            Swal.fire({
                title: '¡Añadida!',
                text: 'Planta añadida con éxito',
                icon: 'success',
                confirmButtonColor: '#3a5a40',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (err) { 
            Swal.fire({
                title: 'Error',
                text: 'Error al añadir la planta',
                icon: 'error',
                confirmButtonColor: '#3a5a40'
            });
        }
    };

    const handleDelete = async (id) => {
        
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás recuperar esta planta",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Rojo para peligro
            cancelButtonColor: '#3a5a40', // Verde para cancelar
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem('token');
            
            // ANTES: await axios.delete(...)
            // AHORA: Llamamos al servicio
            await plantService.removePlant(id, token);

            setPlants(plants.filter(plant => plant._id !== id));
            
            Swal.fire({
                icon: 'success',
                title: 'Eliminada',
                showConfirmButton: false,
                timer: 1000
            });

        } catch (err) { 
            Swal.fire({
                title: 'Error',
                text: 'Error al eliminar',
                icon: 'error',
                confirmButtonColor: '#3a5a40'
            });
        }
    };

    const handleWatering = async (id, customDate = null) => {
        try {
            const token = localStorage.getItem('token');
            const dateToSave = customDate || new Date().toISOString().split('T')[0];
            
            // ANTES: await axios.put(...)
            // AHORA: Llamamos al servicio
            await plantService.registerWatering(id, dateToSave, token);

            setPlants(prevPlants => 
                prevPlants.map(p => {
                    if (p._id === id) return { ...p, lastWatered: dateToSave };
                    return p;
                })
            );
            
            Swal.fire({
                icon: 'success',
                title: '¡Riego registrado!',
                showConfirmButton: false,
                timer: 1500
            });

        } catch (err) { 
            Swal.fire({
                title: 'Error',
                text: 'Error al registrar el riego.',
                icon: 'error',
                confirmButtonColor: '#3a5a40'
            });
        }
    };

    const getWateringStatus = (lastDate, frequency) => {
        const last = new Date(lastDate);
        last.setHours(12, 0, 0, 0);
        const nextDate = new Date(last);
        nextDate.setDate(last.getDate() + parseInt(frequency));
        nextDate.setHours(12, 0, 0, 0);
        const today = new Date();
        today.setHours(12, 0, 0, 0);

        if (today.getTime() === nextDate.getTime()) return 'TODAY';
        if (today.getTime() > nextDate.getTime()) return 'OVERDUE';
        return 'FUTURE';
    };

    const calculateNextWatering = (lastDate, frequency) => {
        const date = new Date(lastDate);
        date.setHours(date.getHours() + 12);
        date.setDate(date.getDate() + parseInt(frequency));
        return date.toLocaleDateString();
    };

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    // --- HTML CON CLASES CSS ---
    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h1 className="logo">MOMENTO<span>VERDE</span></h1>
                <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
            </nav>

            <div className="main-content">
                {/* FORMULARIO */}
                <section className="form-section">
                    <form onSubmit={handleAddPlant} className="plant-form">
                        <h2>Nueva planta</h2>
                        <div className="form-grid">
                            <input type="text" placeholder="Nombre" value={newPlant.name} onChange={e => setNewPlant({...newPlant, name: e.target.value})} required className="clean-input" />
                            <input type="text" placeholder="Especie" value={newPlant.species} onChange={e => setNewPlant({...newPlant, species: e.target.value})} className="clean-input" />
                            <input type="number" placeholder="Días de riego" min="1" value={newPlant.wateringFrequency} onChange={e => setNewPlant({...newPlant, wateringFrequency: e.target.value})} required className="clean-input" />
                            <div className="date-group">
                                <label>Último riego:</label>
                                <input type="date" value={newPlant.lastWatered} onChange={e => setNewPlant({...newPlant, lastWatered: e.target.value})} required className="clean-input" />
                            </div>
                        </div>

                        <div className="action-row">
                            <label className="file-label">
                                {newPlant.image ? 'FOTO LISTA' : 'SUBIR FOTO'}
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                            </label>
                            <button type="submit" className="btn-primary">AÑADIR PLANTA</button>
                        </div>
                    </form>
                </section>

                {/* LISTA DE PLANTAS */}
                {plants.length === 0 ? (
                    <div className="empty-state">
                        <p>Tu jardín está vacío.</p>
                    </div>
                ) : (
                    <div className="gallery-grid">
                        {plants.map(plant => {
                            const status = getWateringStatus(plant.lastWatered, plant.wateringFrequency);
                            const nextDateStr = calculateNextWatering(plant.lastWatered, plant.wateringFrequency);

                            return (
                                <div key={plant._id} className="plant-card">
                                    <div className="image-wrapper">
                                        {plant.image ? (
                                            <img src={plant.image} alt={plant.name} />
                                        ) : (
                                            <div className="no-image"></div>
                                        )}
                                        <button onClick={() => handleDelete(plant._id)} className="btn-delete">✕</button>
                                    </div>

                                    <div className="card-content">
                                        <h3>{plant.name}</h3>
                                        <p className="species">{plant.species}</p>
                                        
                                        <div className="info-row">
                                            <span>Cada {plant.wateringFrequency} días</span>
                                            <span className="next-date">{nextDateStr}</span>
                                        </div>

                                        <div className="status-area">
                                            {status === 'TODAY' && (
                                                <button onClick={() => handleWatering(plant._id)} className="btn-today">
                                                    REGAR HOY
                                                </button>
                                            )}

                                            {status === 'OVERDUE' && (
                                                <div className="overdue-box">
                                                    <p>Retrasado</p>
                                                    <div className="overdue-actions">
                                                        <input type="date" id={`date-${plant._id}`} defaultValue={new Date().toISOString().split('T')[0]} />
                                                        <button onClick={() => {
                                                                const selectedDate = document.getElementById(`date-${plant._id}`).value;
                                                                handleWatering(plant._id, selectedDate);
                                                            }}>OK</button>
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'FUTURE' && (
                                                <div className="status-ok">Todo bien</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;