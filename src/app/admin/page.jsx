// src/app/admin/page.jsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
// ✨ Importar el módulo CSS
import styles from './dashboard.module.css';

// URL del catálogo de autos
const API_CARS_URL = "https://690aa7dc1a446bb9cc234227.mockapi.io/cars";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAutos: 0,
    autosVisibles: 0,
    autosOcultos: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(API_CARS_URL);
      if (response.ok) {
        const data = await response.json();
        
        const totalAutos = data.length;
        const autosOcultos = data.filter(car => car.isRented).length;
        const autosVisibles = totalAutos - autosOcultos;
        
        setStats({
            totalAutos: totalAutos,
            autosVisibles: autosVisibles,
            autosOcultos: autosOcultos
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Título principal */}
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard de Administración</h1>
        <p className={styles.subtitle}>
          Gestiona la visibilidad de los autos en el catálogo
        </p>
      </div>
      
      {/* Estadísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Total de Autos</div>
            <div className={styles.statNumber}>{stats.totalAutos}</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Autos Disponibles</div>
            {/* Usamos la clase condicional para el color */}
            <div className={`${styles.statNumber} ${styles.statNumberGreen}`}>
              {stats.autosVisibles}
            </div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Autos Rentados/Ocultos</div>
            {/* Usamos la clase condicional para el color */}
            <div className={`${styles.statNumber} ${styles.statNumberRed}`}>
              {stats.autosOcultos}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className={styles.actionsCard}>
        <div className={styles.actionsContent}>
          <h3 className={styles.actionsTitle}>Acciones Rápidas</h3>
          <div className={styles.actionsGrid}>
            <Link
              href="/admin/autos"
              className={styles.actionPrimary}
            >
              Gestionar Inventario
            </Link>
            <Link
              href="/catalogo"
              className={styles.actionSecondary}
            >
              Ver Catálogo Público
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}