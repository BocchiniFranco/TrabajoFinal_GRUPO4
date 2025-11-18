'use client'; 

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* 1. Logo y Copyright */}
        <div style={styles.section}>
          <h4 style={styles.title}>CAR RENTAL APP 🚗</h4>
          <p style={styles.text}>© {new Date().getFullYear()} Grupo 4. Todos los derechos reservados.</p>
        </div>

        {/* 2. Enlaces Rápidos */}
        <div style={styles.section}>
          <h5 style={styles.heading}>Enlaces Rápidos</h5>
          <Link href="/catalogo" style={styles.link}>Catálogo</Link>
          <Link href="/admin" style={styles.link}>Panel Admin</Link>
        </div>

        {/* 3. Información Legal */}
        <div style={styles.section}>
          <h5 style={styles.heading}>Información Legal</h5>
          <Link href="/legales" style={styles.link}>Términos de Servicio</Link>
          <Link href="/legales" style={styles.link}>Política de Privacidad</Link>
        </div>
        
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#222', 
    color: '#ccc',
    padding: '30px 20px',
    marginTop: 'auto', // Asegura que el footer se pegue al fondo
    borderTop: '1px solid #333'
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    flexWrap: 'wrap',
    gap: '20px',
  },
  section: {
    flex: '1 1 200px',
    marginBottom: '15px'
  },
  title: {
    fontSize: '1.2rem',
    color: '#fff',
    marginBottom: '10px'
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#ddd'
  },
  text: {
    fontSize: '0.85rem',
    margin: 0,
    color: '#aaa'
  },
  link: {
    display: 'block',
    fontSize: '0.9rem',
    color: '#aaa',
    textDecoration: 'none',
    marginBottom: '5px',
    transition: 'color 0.2s'
  },
};