// Components/AuthChecker.jsx
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Componente para verificar autenticación y rol
export default function AuthChecker({ children, allowedRoles = ['user', 'admin'] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Esperar a que la sesión cargue

    // 1. Verificar Autenticación
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 2. Verificar Roles
    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Acceso denegado: redirige a la página principal
      alert(`Acceso denegado. Rol: ${user.role}`);
      router.push('/'); 
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  // Si está cargando o no cumple los requisitos, no renderiza la página
  if (isLoading || !isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return <div style={{padding: '2rem'}}>Verificando permisos...</div>;
  }

  // Si cumple los requisitos, renderiza la página
  return <>{children}</>;
}