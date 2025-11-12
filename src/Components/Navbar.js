'use client'; // Necesario para usar useAuth, useRouter

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext'; // Importar el hook de autenticación
import { useRouter } from 'next/navigation';

export default function Navbar() {
  // Obtener estado y funciones del contexto
  const { isAuthenticated, user, logout } = useAuth(); 
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // No se necesita el router.push('/login') porque ya lo tiene en el AuthContext
  };

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      background: '#222',
      color: 'white', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
    }}>
      {/* 🧭 Sección de Enlaces Principales */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/" style={linkStyle}>Inicio</Link>
        <Link href="/catalogo" style={linkStyle}>Catálogo</Link>
        <Link href="/legales" style={linkStyle}>Legales</Link>

        {/* 🛡️ Ruta Exclusiva para Administradores */}
        {user?.role === 'admin' && (
          <Link 
            href="/admin" 
            style={{ 
              ...linkStyle, 
              color: '#FFD700', 
              fontWeight: 'bold',
              background: 'rgba(255, 215, 0, 0.1)',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #FFD700'
            }}
          >
            🛡️ ADMIN
          </Link>
        )}
      </div>

      {/* 👤 Sección de Autenticación y Perfil */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isAuthenticated ? (
          <>
            {/* Mensaje de Bienvenida y Rol */}
            <span style={{ 
              color: '#bbb', 
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>Hola, <strong>{user.name || user.email}</strong></span>
              <span style={{
                padding: '2px 6px',
                background: user.role === 'admin' ? '#FFD700' : '#007bff',
                color: user.role === 'admin' ? '#000' : '#fff',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}>
                {user.role?.toUpperCase()}
              </span>
            </span>
            
            {/* Botón de Cerrar Sesión */}
            <button 
              onClick={handleLogout} 
              style={buttonStyle}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          // Enlace de Login si no está autenticado
          <Link href="/login" style={{ 
            ...linkStyle, 
            padding: '8px 16px', 
            border: '1px solid #007bff', 
            borderRadius: '4px',
            background: '#007bff',
            fontWeight: 'bold'
          }}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  )
}

// Estilos base para los enlaces y botones
const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '5px',
  transition: 'all 0.2s',
};

const buttonStyle = {
  padding: '8px 16px',
  background: '#dc3545', // Rojo para cerrar sesión
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background 0.2s',
};

// Agregar hover effects
linkStyle[':hover'] = {
  color: '#007bff'
};

buttonStyle[':hover'] = {
  background: '#c82333'
};