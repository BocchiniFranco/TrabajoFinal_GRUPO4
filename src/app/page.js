// src/app/page.js

import React from 'react';

export default function HomePage() {
  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>¡Bienvenido al Catálogo de Autos!</h1>
      <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
        Explora nuestra selección de vehículos o inicia sesión para gestionar el inventario.
      </p>
      
      <a href="/catalogo" style={{ display: 'inline-block', marginTop: '2rem', padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Ver Catálogo
      </a>
      
    </main>
  );
}