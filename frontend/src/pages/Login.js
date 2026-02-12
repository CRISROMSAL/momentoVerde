import React, { useState } from 'react'; 
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import '../App.css'; // <--- ESTO ES LO ÚNICO NUEVO TÉCNICAMENTE (Para cargar el diseño)

const Login = () => {
    // --- TU LÓGICA ORIGINAL EXACTA (INTACTA) ---
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

    // --- EL DISEÑO NUEVO (SOLO CAMBIA EL HTML/CLASES) ---
    return (
        <div className="login-container">
            <div className="login-card">
                {/* Cabecera bonita */}
                <h1 className="login-logo">MOMENTO<span>VERDE</span></h1>
                <p className="login-subtitle">El cuidado de tu jardín</p>

                <form onSubmit={onSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="tucorreo@ejemplo.com" 
                            // Aquí usamos tu formData.email
                            value={formData.email} 
                            onChange={onChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="••••••••" 
                            // Aquí usamos tu formData.password
                            value={formData.password} 
                            onChange={onChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn-login">Entrar</button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;