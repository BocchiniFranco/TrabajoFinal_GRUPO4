'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './admin-management.module.css';
import { API_CONFIG } from '@/config/config';    

const API_CARS_URL = API_CONFIG.API_CARS_URL;
const API_RESERVATIONS_URL = API_CONFIG.API_BASE_URL_LOCAL + '/reservations'; // NUEVA URL

export default function AdminCarManagementPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  // Función auxiliar para formatear fechas correctamente
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Fecha Desconocida';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha Inválida';
    }
  };

  // --- 1. FUNCIÓN DE ELIMINAR (DELETE) ---
  const deleteCar = async (carId, model) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el auto ${model} (ID: ${carId})? Esta acción es irreversible.`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_CARS_URL}/${carId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Fallo al eliminar el auto ${carId}.`);
      }

      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      alert(`Auto ${model} (ID: ${carId}) eliminado exitosamente.`);
      
    } catch (error) {
      console.error("Error al eliminar el auto:", error);
      alert(`ERROR: No se pudo eliminar el auto. ${error.message}`);
    }
  };

  // --- 2. FUNCIÓN DE LIBERAR AUTO (ACTUALIZADA) ---
  const releaseCar = async (carId) => {
    if (!confirm(`¿Estás seguro de que deseas liberar este auto (ID: ${carId})? Esto cancelará la reserva activa.`)) {
      return;
    }
    
    try {
      // USAR EL NUEVO ENDPOINT DE RESERVATIONS
      const response = await fetch(`${API_RESERVATIONS_URL}/car/${carId}/active`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Fallo al liberar el auto ${carId}.`);
      }
      
      // Recargar los datos para reflejar el cambio
      await fetchCars();
      
      alert(`Auto liberado exitosamente.`);

    } catch (error) {
      console.error("Error al liberar el auto:", error);
      alert(`ERROR: No se pudo liberar el auto. ${error.message}`);
    }
  };
  
  // --- 3. FUNCIÓN DE EDITAR ---
  const handleEdit = (carId) => {
    router.push(`/admin/autos/editar/${carId}`);
  };

  // --- 4. FUNCIÓN PARA CREAR ---
  const handleCreate = () => {
    router.push('/admin/autos/crear');
  };

  if (loading) {
    return <div className={styles.loadingContainer}><div className={styles.loadingText}>Cargando gestión de autos...</div></div>;
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
            <h1 className={styles.title}>Gestión de Inventario ({cars.length} Autos)</h1>
            <p className={styles.subtitle}>Alternar el estado de alquiler, editar y eliminar.</p>
        </div>
        
        {/* BOTÓN NUEVO PARA CREAR AUTO */}
        <button 
            onClick={handleCreate}
            className={styles.buttonBase}
            style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 20px', fontSize: '1rem' }}
        >
            + Crear Nuevo Auto
        </button>
      </div>
      
      <div className={styles.carList}>
        {cars.map((auto) => (
          <div key={auto.id} className={styles.carCard}>
            
            <div className={styles.carInfo}>
              <h3 className={styles.carTitle}>{auto.brand} {auto.model} (ID: {auto.id})</h3>
              <p className={auto.isRented ? styles.statusRented : styles.statusAvailable}>
                {auto.isRented ? 
                  `ALQUILADO hasta: ${formatDateForDisplay(auto.availableUntil)}` 
                  : 
                  'DISPONIBLE'
                }
              </p>
              <p className={styles.price}>${auto.price} / día</p>
              {auto.description && (
                <p className={styles.description}>{auto.description}</p>
              )}
            </div>
            
            <div className={styles.carActions}>
              {/* Botón de Edición */}
              <button
                onClick={() => handleEdit(auto.id)}
                className={`${styles.buttonBase} ${styles.buttonEdit}`}
              >
                Editar
              </button>
              
              {/* Botón de Liberar - SOLO para autos rentados */}
              {auto.isRented && (
                <button 
                  onClick={() => releaseCar(auto.id)}
                  className={`${styles.buttonBase} ${styles.buttonRelease}`}
                >
                  LIBERAR
                </button>
              )}
          
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