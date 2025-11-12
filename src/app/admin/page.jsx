'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalAutos: 0,
    autosVisibles: 0,
    autosOcultos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Título principal */}
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard de Administración</h1>
        <p style={styles.subtitle}>
          Gestiona la visibilidad de los autos en el catálogo
        </p>
      </div>
      
      {/* Estadísticas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Total de Autos</div>
            <div style={styles.statNumber}>{stats.totalAutos}</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Autos Visibles</div>
            <div style={{...styles.statNumber, color: '#059669'}}>
              {stats.autosVisibles}
            </div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statContent}>
            <div style={styles.statLabel}>Autos Ocultos</div>
            <div style={{...styles.statNumber, color: '#dc2626'}}>
              {stats.autosOcultos}
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div style={styles.actionsCard}>
        <div style={styles.actionsContent}>
          <h3 style={styles.actionsTitle}>Acciones Rápidas</h3>
          <div style={styles.actionsGrid}>
            <Link
              href="/admin/autos"
              style={styles.actionPrimary}
            >
              Gestionar Visibilidad de Autos
            </Link>
            <Link
              href="/catalogo"
              style={styles.actionSecondary}
            >
              Ver Catálogo Público
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 0'
  },
  loadingText: {
    fontSize: '1.125rem',
    color: '#6b7280'
  },
  header: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1rem'
  },
  statCard: {
    backgroundColor: 'white',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  },
  statContent: {
    padding: '1.25rem 1.5rem'
  },
  statLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  statNumber: {
    fontSize: '1.875rem',
    fontWeight: '600',
    color: '#111827'
  },
  actionsCard: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb'
  },
  actionsContent: {
    padding: '1.25rem 1.5rem'
  },
  actionsTitle: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '1rem',
    marginTop: 0
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  actionPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  },
  actionSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    cursor: 'pointer'
  }
};