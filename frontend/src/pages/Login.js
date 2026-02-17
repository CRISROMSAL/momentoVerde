import React, { useState } from 'react'; 
// import axios from 'axios';  <-- YA NO LO NECESITAMOS AQUÍ
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import '../App.css';

// IMPORTAMOS EL SERVICIO
import * as authService from '../services/authService';

const Login = () => {
    
    const [formData, setFormData] = useState({ 
        email: '', 
        password: '' 
    });

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            // ANTES: const res = await axios.post('http://localhost:4000/api/auth/login', formData);
            
            // AHORA: Llamada al servicio desacoplado
            const res = await authService.loginUser(formData);
            
            localStorage.setItem('token', res.data.token); 
            
            // CAMBIO: Alerta de error 
            await Swal.fire({
                title: '¡Bienvenido!',
                text: 'Entrando a tu jardín...',
                icon: 'success',
                confirmButtonColor: '#3a5a40',
                timer: 2000,
                showConfirmButton: false
            });
            
            window.location.href = '/dashboard'; 
        } catch (err) {
            console.error(err.response?.data);
            
            // CAMBIO: Alerta de error 
            Swal.fire({
                title: 'Error',
                text: 'Credenciales incorrectas o error de conexión',
                icon: 'error',
                confirmButtonColor: '#3a5a40'
            });
        }
    };

    // --- DISEÑO VISUAL ---
    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-logo">MOMENTO<span>VERDE</span></h1>
                <p className="login-subtitle">El cuidado de tu jardín</p>

                <form onSubmit={onSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={onChange} required />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={onChange} required />
                    </div>

                    <button type="submit" className="btn-login">Entrar</button>
                </form>

                <div className="login-footer">
                    <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;