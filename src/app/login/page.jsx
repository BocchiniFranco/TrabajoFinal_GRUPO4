'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Redirección si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user.role === 'user') {
      router.push('/catalogo');
    }else if (isAuthenticated && user.role === 'admin') {
      router.push('/admin/');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      // Validaciones básicas antes de enviar
      if (!email.trim() || !password.trim()) {
        throw new Error('Por favor completa todos los campos');
      }

      if (!email.includes('@') || !email.includes('.')) {
        throw new Error('Por favor ingresa un email válido');
      }

      // CORRECCIÓN: La función login espera un objeto {email, password}
      const result = await login({ email, password });

      // CORRECCIÓN: Verificar si la respuesta contiene error
      if (result && result.error) {
        setLocalError(result.error);
      }
      
      // Si no hay error y hay éxito, el useEffect manejará la redirección
      // No necesitamos hacer nada más aquí porque el contexto ya actualizó el estado

    } catch (error) {
      console.error("Error en el login:", error.message);
      setLocalError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mostrar un mensaje de carga si la sesión se está verificando
  if (isLoading) {
    return <div className={styles.message}>Verificando sesión...</div>;
  }

  // Si ya está autenticado, mostrar mensaje de redirección
  if (isAuthenticated) {
    return <div className={styles.message}>Autenticado. Redirigiendo...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Iniciar Sesión</h1> 
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Mostrar errores locales */}
        {localError && (
          <div className={styles.errorMessage}>
            {localError}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: usuario@ejemplo.com"
            required
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={styles.submitButton}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </form>

      {/* Información para testing */}
      <div className={styles.demoInfo}>
        
      </div>
    </div>
  );
}