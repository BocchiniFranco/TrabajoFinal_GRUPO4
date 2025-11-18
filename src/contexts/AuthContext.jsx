import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/config/config';

// Crear contexto de autenticación
const AuthContext = createContext(null);

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// URL de la API de usuarios desde la configuración
const API_USERS_URL = API_CONFIG.API_USERS_URL;

// Componente Proveedor de Autenticación
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Estado de carga crucial para evitar redirecciones prematuras
  const [isLoading, setIsLoading] = useState(true); 

  const router = useRouter();

  // Efecto inicial: Revisa la sesión guardada al cargar la aplicación
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const userStorage = localStorage.getItem("user");
        
        if (userStorage) {
          const userData = JSON.parse(userStorage);
          
          // Verifica que los datos existan y tengan información básica
          if (userData && userData.id) { 
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos de usuario desde localStorage:", error);
        // Limpiar datos corruptos
        localStorage.removeItem("user"); 
      } finally {
        setIsLoading(false); // La verificación inicial terminó
      }
    };

    checkStoredAuth();
  }, []);

  // Función de login mejorada con manejo de errores
  const login = async (credentials) => {
    setIsLoading(true);

    try {
      // Validación básica de credenciales
      if (!credentials.email || !credentials.password) {
        return { error: "Por favor ingresa email y contraseña" };
      }

      // Intentamos obtener los usuarios desde la API
      const response = await fetch(API_USERS_URL);

      if (!response.ok) {
        throw new Error("Error en la respuesta de la API de usuarios");
      }

      const users = await response.json();

      // Buscar usuario que coincida con email y contraseña
      const foundUser = users.find(
        user => user.email === credentials.email && user.password === credentials.password
      );

      // Si no existe el usuario, retornar error controlado
      if (!foundUser) {
        return { error: "Usuario o contraseña incorrectos" };
      }

      // Asignar rol basado en el ID (admin si es ID 1, user para otros)
      const role = foundUser.id === "1" ? "admin" : "user";
      const userWithRole = { ...foundUser, role };

      // Actualizar estado y almacenamiento local
      setUser(userWithRole);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithRole));

      // Redirigir después de una pequeña pausa para asegurar la actualización del estado
      setTimeout(() => {
        router.push("/");
      }, 100);

      return { success: true, user: userWithRole };

    } catch (error) {
      // Manejar errores de red, JSON corrupto, servidor no disponible, etc.
      console.error("Error en el proceso de login:", error);
      return { error: "Error de conexión con el servidor" };
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout - cierra la sesión del usuario
  const logout = () => {
    // Limpiar estado
    setUser(null);
    setIsAuthenticated(false);
    
    // Limpiar almacenamiento local
    localStorage.removeItem("user");
    
    // Redirigir al login después de cerrar sesión
    router.push("/login");
  };

  // Valores que estarán disponibles en el contexto
  const contextValue = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}