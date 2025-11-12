'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 1️⃣ Creamos el contexto de autenticación
const AuthContext = createContext();

// 2️⃣ Hook para acceder fácilmente al contexto
export function useAuth() {
  return useContext(AuthContext);
}

// 3️⃣ Componente proveedor de autenticación
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);            // Guarda datos del usuario actual
  const [isLoading, setIsLoading] = useState(true);  // Indica si está cargando
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Indica si hay sesión activa
  const router = useRouter();

  // 4️⃣ Carga el usuario desde localStorage al montar la app
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // 5️⃣ Función de login con roles simulados
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      let loggedUser = null;

      // Si el usuario es admin
      if (email === 'admin@admin.com' && password === 'admin123') {
        loggedUser = { email, role: 'admin' };
      } else {
        loggedUser = { email, role: 'user' };
      }

      // Guardar sesión
      localStorage.setItem('user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      setIsAuthenticated(true);

      // Redirigir según rol
      if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/catalogo');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 6️⃣ Función de logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  // 7️⃣ Proveedor del contexto
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 8️⃣ Export por defecto para poder importarlo fácilmente
export default AuthProvider;