import React, { useState } from 'react';
import axios from 'axios';

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

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Crear Cuenta 🌿</h2>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" placeholder="Nombre de usuario" name="username" value={username} onChange={onChange} required style={{ padding: '8px' }} />
                <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required style={{ padding: '8px' }} />
                <input type="password" placeholder="Contraseña" name="password" value={password} onChange={onChange} required style={{ padding: '8px' }} />
                <input type="password" placeholder="Confirmar contraseña" name="confirmPassword" value={confirmPassword} onChange={onChange} required style={{ padding: '8px' }} />
                
                <button type="submit" style={{ background: '#4CAF50', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
                    Registrarse
                </button>
            </form>
            <p style={{ marginTop: '15px' }}>
                ¿Ya tienes cuenta? <a href="/">Inicia sesión aquí</a>
            </p>
        </div>
    );
};

export default Register;