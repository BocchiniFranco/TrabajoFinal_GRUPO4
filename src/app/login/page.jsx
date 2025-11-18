'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirección si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Llamar a la función login de tu contexto con las credenciales
    const result = await login({ email, password }); 

    if (result && result.error) {
        // El AuthContext ya muestra una alerta, pero puedes agregar manejo de UI aquí
        console.error("Fallo el login:", result.error);
    }
  };

  // Mostrar un mensaje de carga si la sesión se está verificando
  if (isLoading) {
    return <div className={styles.message}>Cargando sesión...</div>;
  }
  
  // Si ya está autenticado (y no está cargando), el useEffect lo redirigirá.
  if (isAuthenticated) {
    return <div className={styles.message}>Autenticado. Redirigiendo...</div>;
  }

  return (
    <div className={styles.container}>
      {/* ✨ Usamos la clase title */}
      <h1 className={styles.title}>Iniciar Sesión</h1> 
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: nombre@mail.com"
            required
            className={styles.input}
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
          />
        </div>
        <button type="submit" disabled={isLoading} className={styles.submitButton}>
          {isLoading ? 'Conectando...' : 'Entrar'}
        </button>
      </form>
      <p className={styles.message}>
      </p>
    </div>
  );
}