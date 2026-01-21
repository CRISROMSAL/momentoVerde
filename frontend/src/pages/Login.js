import React, { useState } from 'react'; // Importante para el estado
import axios from 'axios'; // Importante para la conexión
import { Link } from 'react-router-dom';

const Login = () => {
    // Definimos formData y la función para actualizarlo
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '' 
    });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // Usamos formData aquí para enviarlo al backend
            const res = await axios.post('http://localhost:4000/api/auth/login', formData);
            
            localStorage.setItem('token', res.data.token); 
            alert('¡Bienvenido!');
            window.location.href = '/dashboard'; 
        } catch (err) {
            console.error(err.response?.data);
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={onSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={onChange} required />
                <br /><br />
                <input type="password" name="password" placeholder="Contraseña" onChange={onChange} required />
                <br /><br />
                <button type="submit">Entrar</button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
        </div>
    );
};

export default Login;