import React, { useState } from 'react';
// import axios from 'axios'; <-- YA NO LO NECESITAMOS
import Swal from 'sweetalert2'; 
import '../App.css'; 

// IMPORTAMOS EL SERVICIO (Ya lo creamos en el paso anterior)
import * as authService from '../services/authService';

const Register = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { username, email, password, confirmPassword } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        
        // CAMBIO: Alerta visual si no coinciden (INTACTO)
        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonColor: '#3a5a40'
            });
            return;
        }

        // Validación extra (INTACTO)
        if (password.length < 6) {
            Swal.fire({
                title: 'Contraseña débil',
                text: 'La contraseña debe tener al menos 6 caracteres',
                icon: 'warning',
                confirmButtonColor: '#3a5a40'
            });
            return;
        }

        try {
            // ANTES: const res = await axios.post(...)
            
            // AHORA: Llamada al servicio desacoplado
            // Nota: Mantenemos el mapeo de "username" (estado) a "name" (lo que pide el backend)
            const res = await authService.registerUser({
                name: username, 
                email: email,
                password: password
            });

            localStorage.setItem('token', res.data.token);
            
            // CAMBIO: Alerta de éxito con temporizador antes de redirigir (INTACTO)
            await Swal.fire({
                title: '¡Bienvenido!',
                text: 'Usuario registrado con éxito',
                icon: 'success',
                confirmButtonColor: '#3a5a40',
                timer: 2000,
                showConfirmButton: false
            });

            window.location.href = '/dashboard';
        } catch (err) {
            // Estodirá en la consola (F12) el motivo real del Error 500
            console.error("Detalle del error del servidor:", err.response?.data);
            
            // CAMBIO: Alerta de error visual (INTACTO)
            Swal.fire({
                title: 'Error',
                text: err.response?.data?.msg || 'Error al registrarse. Intenta con otro email.',
                icon: 'error',
                confirmButtonColor: '#3a5a40'
            });
        }
    };

    // --- HTML VISUAL (INTACTO) ---
    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-logo">MOMENTO<span>VERDE</span></h1>
                <h2 className="login-title">Crear Cuenta</h2>
                <p className="login-subtitle">Empieza a cuidar tus plantas hoy</p>

                <form onSubmit={onSubmit} className="login-form">
                    
                    <div className="input-group">
                        <label>Nombre de usuario</label>
                        <input 
                            type="text" 
                            placeholder="Tu nombre" 
                            name="username" 
                            value={username} 
                            onChange={onChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            placeholder="tucorreo@ejemplo.com" 
                            name="email" 
                            value={email} 
                            onChange={onChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Mínimo 6 caracteres" 
                            name="password" 
                            value={password} 
                            onChange={onChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirmar contraseña</label>
                        <input 
                            type="password" 
                            placeholder="Repite tu contraseña" 
                            name="confirmPassword" 
                            value={confirmPassword} 
                            onChange={onChange} 
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn-login">
                        REGISTRARSE
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        ¿Ya tienes cuenta? <a href="/">Inicia sesión aquí</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;