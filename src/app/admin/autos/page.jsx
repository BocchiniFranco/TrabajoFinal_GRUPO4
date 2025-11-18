'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './admin-management.module.css';

const API_CARS_URL = "https://690aa7dc1a446bb9cc234227.mockapi.io/cars";

export default function AdminCarManagementPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Función para alternar el estado (UPDATE)
  const toggleAvailability = async (carId, currentState) => {
    setCars(prevCars => prevCars.map(car => {
      if (car.id === carId) {
        return {
          ...car,
          isRented: !currentState,
          availableUntil: !currentState ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null,
        };
      }
      return car;
    }));
    alert(`Estado del auto ${carId} simulado como ${currentState ? 'DISPONIBLE' : 'RENTADO'}.`);
  };
  

  const deleteCar = async (carId, model) => {
      if (!confirm(`¿Estás seguro de que deseas eliminar el auto ${model} (ID: ${carId})? Esta acción es irreversible.`)) {
          return;
      }
      
      setCars(prevCars => prevCars.filter(car => car.id !== carId));
      alert(`Auto ${model} (ID: ${carId}) simulado como eliminado.`);
      
  };


  if (loading) {
    return <div className={styles.loadingContainer}><div className={styles.loadingText}>Cargando gestión de autos...</div></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestión de Inventario ({cars.length} Autos)</h1>
      <p className={styles.subtitle}>Alternar el estado de alquiler y eliminar.</p>
      
      <div className={styles.carList}>
        {cars.map((auto) => (
          <div key={auto.id} className={styles.carCard}>
            <div className={styles.carInfo}>
              <h3 className={styles.carTitle}>{auto.brand} {auto.model} (ID: {auto.id})</h3>
              <p className={auto.isRented ? styles.statusRented : styles.statusAvailable}>
                {auto.isRented ? 
                  `ALQUILADO hasta: ${new Date(auto.availableUntil).toLocaleDateString()}` 
                  : 
                  'DISPONIBLE'
                }
              </p>
            </div>
            
            <div className={styles.carActions}>
                {/* Botón de Alternar Disponibilidad */}
                <button 
                  onClick={() => toggleAvailability(auto.id, auto.isRented)}
                  className={`${styles.buttonBase} ${auto.isRented ? styles.buttonRelease : styles.buttonRent}`}
                >
                  {auto.isRented ? 'LIBERAR AUTO' : 'MARCAR COMO RENTADO'}
                </button>
            
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