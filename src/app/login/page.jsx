// app/login/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Ajusta la ruta si es necesario
import { useRouter } from 'next/navigation';

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
    return <div style={{padding: '2rem'}}>Cargando sesión...</div>;
  }
  
  // Si ya está autenticado (y no está cargando), el useEffect lo redirigirá.
  if (isAuthenticated) {
    return <div style={{padding: '2rem'}}>Autenticado. Redirigiendo...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: admin@mail.com"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña: 123"
            required
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '0.75rem', width: '100%', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
      </p>
    </div>
  );
}