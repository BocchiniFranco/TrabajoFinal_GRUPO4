'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './registro.module.css';

// Configuración directa para evitar problemas de importación
const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    REGISTER: '/users',
    LOGIN: '/users/login'
  }
};

const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '' // ✅ Solo los campos que tu modelo acepta
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validaciones frontend
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('❌ Por favor completa todos los campos');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('❌ La contraseña debe tener al menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setMessage('❌ Por favor ingresa un email válido');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('📤 Enviando datos a:', getApiUrl(API_CONFIG.ENDPOINTS.REGISTER));
      console.log('📝 Datos enviados:', {
        name: formData.name,
        email: formData.email,
        password: '***' // No loguear la contraseña real
      });
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
          // ✅ Solo enviamos los campos que el backend espera
        }),
      });

      console.log('📥 Response status:', response.status);

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Respuesta no JSON:', text.substring(0, 200));
        throw new Error('El servidor devolvió una respuesta inesperada');
      }

      const data = await response.json();
      console.log('✅ Data recibida:', data);

      if (response.ok) {
        setMessage('✅ Usuario creado exitosamente. Redirigiendo al login...');
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        });
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || 'Error al crear usuario'}`);
      }
    } catch (error) {
      console.error('💥 Error completo:', error);
      setMessage(`❌ ${error.message || 'Error de conexión con el servidor'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Cuenta</h1>

      {message && (
        <div className={message.includes('✅') ? styles.successMessage : styles.errorMessage}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nombre completo:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Ingresa tu nombre completo"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="usuario@ejemplo.com"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className={styles.input}
            placeholder="Mínimo 6 caracteres"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmar contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
            className={styles.input}
            placeholder="Repite tu contraseña"
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <div className={styles.loginLink}>
        <p>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className={styles.link}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}