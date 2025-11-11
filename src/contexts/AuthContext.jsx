
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

// Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext); 

// API de USERS
const API_USERS_URL = "https://690aa7dc1a446bb9cc234227.mockapi.io/users";

// Componente Proveedor de Autenticación
export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // isLoading es crucial para evitar que el AuthChecker redirija antes de tiempo
  const [isLoading, setIsLoading] = useState(true); 

  const router = useRouter();

  // 1. EFECTO INICIAL: Revisa la sesión guardada al cargar la aplicación
  useEffect(() => {
    try {
      const userStorage = localStorage.getItem("user");
      
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        
        // Verifica que la data exista y tenga la información básica
        if (userData && userData.id) { 
            setUser(userData);
            setIsAuthenticated(true);
        }
      }
    } catch (error) {
        console.error("Error al cargar datos de usuario desde localStorage:", error);
        localStorage.removeItem("user"); 
    } finally {
        setIsLoading(false); // La verificación terminó
    }
  }, []);

  // 2. FUNCIÓN DE LOGIN
  const login = async(credentials) => {
    setIsLoading(true);
    
    try {
        const resp = await fetch(API_USERS_URL);
        const data = await resp.json();

        // Buscar el usuario en la data recibida
        const userFind = data.find(
            u => u.email === credentials.email && u.password === credentials.password
        );

        if(userFind){
            // ASIGNACIÓN DE ROLES (chicos esto hay que cambiarlo en la API real, que sea un campo extra):
            // En este caso asumimos que el primer usuario (id: 1) es el administrador, y el resto son usuarios básicos.
            const role = userFind.id === '1' ? 'admin' : 'user';
            const userWithRole = { ...userFind, role: role };
            
            setUser(userWithRole);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userWithRole));
            
            router.push("/"); // Redirige a la página principal después del login
            return userWithRole;
        }else{
            setIsAuthenticated(false);
            alert("Usuario o Contraseña Incorrectos");
            return {error: "Usuario o Contraseña Incorrectos"};
        }
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        alert("Hubo un error al intentar iniciar sesión. Inténtalo de nuevo.");
        return {error: "Error de conexión"};
    } finally {
        setIsLoading(false);
    }
  }

  // 3. FUNCIÓN DE LOGOUT
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    router.push("/login"); // Redirige al login después de cerrar sesión
  }


  return (
    <AuthContext.Provider value={{user, isLoading, login, logout, isAuthenticated}}>
        {children}
    </AuthContext.Provider>
  );
}