import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/config/config';

// Crear contexto de autenticación
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext); 

// ------------------------------------------------------------------
// ❌ CÓDIGO VIEJO (MOCK API) - COMENTADO
// const API_USERS_URL = API_CONFIG.API_USERS_URL;
// ------------------------------------------------------------------

// ✅ CÓDIGO NUEVO (BACKEND REAL)
// Usamos la URL de Login que definimos (o la construimos aquí si no está en config)
const API_AUTH_URL = "http://localhost:3001/users/login"; 

export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  const router = useRouter();

  // 1. EFECTO INICIAL (Se mantiene igual)
  useEffect(() => {
    try {
      const userStorage = localStorage.getItem("user");
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        if (userData && userData.id) { 
            setUser(userData);
            setIsAuthenticated(true);
        }
      }
    } catch (error) {
        console.error("Error al cargar datos:", error);
        localStorage.removeItem("user"); 
    } finally {
        setIsLoading(false);
    }
  }, []);

  // Función de login mejorada con manejo de errores
  const login = async (credentials) => {
    setIsLoading(true);
    
    /* ------------------------------------------------------------------
       ❌ LÓGICA VIEJA (MOCK API) - YA NO VA
       ------------------------------------------------------------------
    try {
        const resp = await fetch(API_USERS_URL);
        const data = await resp.json();
        
        // Esto era inseguro: buscaba en una lista descargada
        const userFind = data.find(
            u => u.email === credentials.email && u.password === credentials.password
        );

        if(userFind){
            const role = userFind.id === '1' ? 'admin' : 'user';
            const userWithRole = { ...userFind, role: role };
            setUser(userWithRole);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userWithRole));
            router.push("/"); 
            return userWithRole;
        } else {
            setIsAuthenticated(false);
            alert("Usuario o Contraseña Incorrectos");
            router.push("/login"); // El "parche" para desbloquear
            return {error: "Incorrectos"};
        }
    } catch (error) { ... } 
    finally { setIsLoading(false); } 
    ------------------------------------------------------------------ */

    // ✅ LÓGICA NUEVA (CONEXIÓN AL BACKEND REAL de TP2)
    try {
        const resp = await fetch(API_AUTH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials) // Enviamos { email, password }
        });

        const data = await resp.json();

        if (resp.ok) {
            // ÉXITO (El backend respondió 200 OK y devolvió el usuario)
            const userLogged = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role
                // Nota: El backend NO devuelve la password, lo cual es correcto y seguro.
            };
            
            setUser(userLogged);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(userLogged));
            
            router.push("/"); 
            setIsLoading(false); // Apagamos carga explícitamente
            return userLogged;
        } else {
            // ERROR DE CREDENCIALES (El backend respondió 401 o 404)
            setIsAuthenticated(false);
            alert(data.message || "Usuario o Contraseña Incorrectos");
            setIsLoading(false); // Apagamos carga explícitamente para desbloquear botón
            return { error: data.message };
        }

    } catch (error) {
        // ERROR DE CONEXIÓN (El servidor está apagado o no responde)
        console.error("Error de conexión:", error);
        alert("Error al conectar con el servidor. Verifique que el backend esté corriendo.");
        setIsLoading(false); // Apagamos carga explícitamente
        return { error: "Error de conexión" };
    }
  };

  // 3. FUNCIÓN DE LOGOUT (Se mantiene igual)
  const logout = () => {
    // Limpiar estado
    setUser(null);
    setIsAuthenticated(false);
    
    // Limpiar almacenamiento local
    localStorage.removeItem("user");
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}