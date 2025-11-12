'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Componente que restringe acceso a rutas según rol
export default function AuthChecker({ children, allowedRoles = ['user', 'admin'] }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Esperar a que termine de cargar la sesión

    // 1. Verificar autenticación
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 2. Verificar rol
    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Si el rol no está permitido, se redirige al home
      alert(`Acceso denegado. Rol: ${user.role}`);
      router.push('/');
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  if (isLoading || !isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return <div style={{ padding: '2rem' }}>Verificando permisos...</div>;
  }

  // Si pasa todas las verificaciones, muestra el contenido
  return <>{children}</>;
}
