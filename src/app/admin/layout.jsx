'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={styles.layout}>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navContent}>
            <div style={styles.navLeft}>
              <h1 style={styles.navTitle}>Panel de Administración</h1>
            </div>
            <div style={styles.navRight}>
              <Link href="/admin" style={styles.navLink}>
                Dashboard
              </Link>
              <Link href="/admin/autos" style={styles.navLink}>
                Gestionar Autos
              </Link>
              <Link href="/catalogo" style={styles.navButton}>
                Volver al Catálogo
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  layout: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    fontSize: '1.125rem'
  },
  nav: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  },
  navContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '4rem'
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center'
  },
  navTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  navLink: {
    color: '#374151',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s'
  },
  navButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background-color 0.2s'
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1.5rem 1rem'
  }
};