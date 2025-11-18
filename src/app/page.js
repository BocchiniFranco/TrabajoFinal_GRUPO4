'use client'; 
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; 
import styles from './page.module.css';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth(); 
  
  const handleContactSubmit = (e) => {
      e.preventDefault();
      alert('Mensaje enviado. (Funcionalidad real no implementada)');
  };

  return (
    <main className={styles.mainContainer}>
      
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Encuentra el Auto Perfecto para tu Próxima Aventura
          </h1>
          <p className={styles.heroSubtitle}>
            {isAuthenticated ? 
              `👋 Hola, ${user.name || user.email}. ¡Tu rol es ${user.role}!` 
              : 
              "Explora el catálogo o inicia sesión para acceder a la gestión de inventario."
            }
          </p>
          
          <Link href="/catalogo" className={styles.ctaButton}>
             Ver Catálogo de Vehículos
          </Link>

          {isAuthenticated && user.role === 'admin' && (
            <Link href="/admin" className={styles.adminButton}>
                Panel de Administración
            </Link>
          )}
        </div>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.servicesSection}>
            <h2 style={{ marginBottom: '20px' }}>Nuestras Promesas</h2>
            <div className={styles.serviceCards}>
            <div className={styles.card}>
                <h3>🚀 Entrega Rápida</h3>
                <p>Recibe tu auto en la ubicación deseada en tiempo récord.</p>
            </div>
            <div className={styles.card}>
                <h3>💰 Precios Transparentes</h3>
                <p>Sin cargos ocultos. El precio que ves es el que pagas.</p>
            </div>
            <div className={styles.card}>
                <h3>📞 Soporte 24/7</h3>
                <p>Asistencia técnica y ayuda en carretera en cualquier momento.</p>
            </div>
            </div>
        </div>
        
        <div className={styles.contactSection}>
            <h2>📩 Contáctanos</h2>
            <p>¿Tienes alguna pregunta o necesitas asistencia? Déjanos tu mensaje.</p>
            
            <form onSubmit={handleContactSubmit} className={styles.contactForm}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" required />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="message">Mensaje:</label>
                <textarea id="message" rows="4" required></textarea>
            </div>
            <button type="submit" className={styles.submitButton}>
                Enviar Mensaje
            </button>
            </form>
        </div>
      </div>
      
    </main>
  );
}