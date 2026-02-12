import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // <--- ÚNICO AÑADIDO TÉCNICO: Cargar el diseño

const Register = () => {
    // --- TU LÓGICA ORIGINAL EXACTA (INTACTA) ---
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
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        // Validación extra: El backend suele dar error 500 si la clave es muy corta
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            // CAMBIO AQUÍ: Enviamos 'name' en lugar de 'username' 
            // para coincidir con lo que suele pedir el Modelo de MongoDB
            const res = await axios.post('http://localhost:4000/api/auth/register', {
                name: username, 
                email: email,
                password: password
            });

            localStorage.setItem('token', res.data.token);
            alert('Usuario registrado con éxito');
            window.location.href = '/dashboard';
        } catch (err) {
            // Esto te dirá en la consola (F12) el motivo real del Error 500
            console.error("Detalle del error del servidor:", err.response?.data);
            alert(err.response?.data?.msg || 'Error al registrarse. Intenta con otro email.');
        }
    };

    // --- NUEVO DISEÑO VISUAL (Lógica visual cambiada a clases CSS) ---
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