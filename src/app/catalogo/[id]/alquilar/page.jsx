'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_CONFIG } from '@/config/config';
import { useAuth } from '@/contexts/AuthContext';
import styles from './alquilar.module.css';

export default function AlquilarPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [car, setCar] = useState(null);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // 1. Cargar datos del auto al iniciar
  useEffect(() => {
    if (!isAuthenticated) {
        router.push('/login'); // Proteger la ruta
        return;
    }

    const fetchCar = async () => {
      try {
        // GET al endpoint del auto específico
        const res = await fetch(`${API_CONFIG.API_CARS_URL}/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCar(data);
        } else {
          alert('Auto no encontrado');
          router.push('/catalogo');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, isAuthenticated, router]);

  // 2. Manejar la confirmación del alquiler
  const handleConfirmRent = async () => {
    if (days < 1) return alert("Mínimo 1 día.");
    setProcessing(true);

    // Calculamos la fecha de devolución: Hoy + N días
    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + parseInt(days));

    try {
      // Enviamos PUT para actualizar el estado del auto
      const res = await fetch(`${API_CONFIG.API_CARS_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isRented: true,
          availableUntil: returnDate.toISOString(),
          // Opcional: Podrías guardar quién lo alquiló si tuvieras ese campo en DB
          // rentedBy: user.id 
        })
      });

      if (res.ok) {
        alert(`¡Alquiler confirmado por ${days} días! Total: $${(car.price * days).toLocaleString()}`);
        router.push('/catalogo');
      } else {
        alert('Error al procesar el alquiler.');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !car) return <div style={{padding:'40px', textAlign:'center'}}>Cargando datos del alquiler...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Alquilar {car.brand} {car.model}</h1>
        <span className={styles.priceHighlight}>Precio por día: ${parseFloat(car.price).toLocaleString()}</span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="days">¿Por cuántos días lo necesitas?</label>
        <input 
          type="number" 
          id="days" 
          min="1" 
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.summary}>
        <span className={styles.totalLabel}>Total a Pagar Estimado:</span>
        <span className={styles.totalPrice}>
            ${(car.price * days).toLocaleString()}
        </span>
      </div>

      <button 
        onClick={handleConfirmRent} 
        disabled={processing} 
        className={styles.confirmButton}
      >
        {processing ? 'Procesando...' : 'CONFIRMAR ALQUILER'}
      </button>
    </div>
  );
}