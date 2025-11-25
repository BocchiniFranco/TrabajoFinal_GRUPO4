// src/app/admin/autos/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Necesario para la redirección de Editar
import styles from './admin-management.module.css';
import { API_CONFIG } from '@/config/config';    


const API_CARS_URL = API_CONFIG.API_CARS_URL;

export default function AdminCarManagementPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Inicializar router

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_CARS_URL);
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (error) {
      console.error('Error al obtener autos:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. FUNCIÓN DE ELIMINAR (DELETE) ---
  const deleteCar = async (carId, model) => {
      if (!confirm(`¿Estás seguro de que deseas eliminar el auto ${model} (ID: ${carId})? Esta acción es irreversible.`)) {
          return;
      }
      
      try {
          // Lógica real de DELETE a la Mock API
          const response = await fetch(`${API_CARS_URL}/${carId}`, {
              method: 'DELETE',
          });
  
          if (!response.ok) {
              // Lanzar error si la API falla (ej. 404)
              throw new Error(`Fallo al eliminar el auto ${carId}.`);
          }
  
          // Si es exitoso, actualizamos el estado local (UI)
          setCars(prevCars => prevCars.filter(car => car.id !== carId));
          alert(`Auto ${model} (ID: ${carId}) eliminado exitosamente.`);
          
      } catch (error) {
          console.error("Error al eliminar el auto:", error);
          alert(`ERROR: No se pudo eliminar el auto. ${error.message}`);
      }
  };

  // --- 2. FUNCIÓN DE ALTERNAR ESTADO (UPDATE - PUT) ---
  const toggleAvailability = async (carId, currentState) => {
    const newState = !currentState;
    const newAvailableUntil = newState ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null;
    
    try {
        // Lógica real de PUT a la Mock API
        const response = await fetch(`${API_CARS_URL}/${carId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                isRented: newState,
                availableUntil: newAvailableUntil,
            }),
        });

        if (!response.ok) {
            throw new Error(`Fallo al actualizar el estado del auto ${carId}.`);
        }
        
        // Si la API es exitosa, actualizamos el estado local (UI)
        setCars(prevCars => prevCars.map(car => {
            if (car.id === carId) {
                return {
                    ...car,
                    isRented: newState,
                    availableUntil: newAvailableUntil,
                };
            }
            return car;
        }));
        
        alert(`Estado del auto ${carId} actualizado a ${newState ? 'RENTADO' : 'DISPONIBLE'} en la API.`);

    } catch (error) {
        console.error("Error al actualizar la disponibilidad:", error);
        alert(`ERROR: No se pudo actualizar el estado del auto ${carId}.`);
    }
  };
  
  // --- 3. FUNCIÓN DE EDITAR (Redirige a una ruta que debes crear) ---
  const handleEdit = (carId) => {
    // Redirige al formulario de edición (debes crear la ruta y la página: /admin/autos/editar/[id])
    router.push(`/admin/autos/editar/${carId}`);
  };


  if (loading) {
    return <div className={styles.loadingContainer}><div className={styles.loadingText}>Cargando gestión de autos...</div></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Inventario ({cars.length} Autos)</h1>
      <p className={styles.subtitle}>Alternar el estado de alquiler, editar y eliminar.</p>
      
      <div className={styles.carList}>
        {cars.map((auto) => (
          <div key={auto.id} className={styles.carCard}>
            
            <div className={styles.carInfo}>
              <h3 className={styles.carTitle}>{auto.brand} {auto.model} (ID: {auto.id})</h3>
              <p className={auto.isRented ? styles.statusRented : styles.statusAvailable}>
                {auto.isRented ? 
                  `ALQUILADO hasta: ${auto.availableUntil ? new Date(auto.availableUntil).toLocaleDateString() : 'Fecha Desconocida'}` 
                  : 
                  'DISPONIBLE'
                }
              </p>
            </div>
            
            <div className={styles.carActions}>
                {/* Botón de Edición */}
                <button
                    onClick={() => handleEdit(auto.id)}
                    className={`${styles.buttonBase} ${styles.buttonEdit}`}
                >
                    Editar
                </button>
                
                {/* Botón de Alternar Disponibilidad */}
                <button 
                  onClick={() => toggleAvailability(auto.id, auto.isRented)}
                  className={`${styles.buttonBase} ${auto.isRented ? styles.buttonRelease : styles.buttonRent}`}
                >
                  {auto.isRented ? 'LIBERAR' : 'RENTAR'}
                </button>
            
                {/* Botón de Eliminar */}
                <button
                    onClick={() => deleteCar(auto.id, auto.model)}
                    className={`${styles.buttonBase} ${styles.buttonDelete}`}
                >
                    Eliminar
                </button>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/admin" className={styles.backLink}>
        ← Volver al Dashboard
      </Link>
    </div>
  );
}

