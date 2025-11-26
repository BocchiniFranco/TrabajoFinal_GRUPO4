'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_CONFIG } from '@/config/config';
import { useAuth } from '@/contexts/AuthContext';
import styles from './alquilar.module.css';

// Configuración de la API de reservas
const API_RESERVATIONS_URL = 'http://localhost:3001/reservations';

export default function AlquilarPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [availability, setAvailability] = useState(null);

  // 1. Cargar datos del auto al iniciar
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchCar = async () => {
      try {
        const res = await fetch(`${API_CONFIG.API_CARS_URL}/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCar(data);
          
          // Establecer fecha mínima (hoy)
          const today = new Date().toISOString().split('T')[0];
          setStartDate(today);
          
          // Calcular fecha por defecto (mañana)
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setEndDate(tomorrow.toISOString().split('T')[0]);
          
        } else {
          alert('Auto no encontrado');
          router.push('/catalogo');
        }
      } catch (error) {
        console.error(error);
        alert('Error al cargar el auto');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, isAuthenticated, router]);

  // 2. Calcular días y precio cuando cambian las fechas
  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end > start) {
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setTotalDays(days);
        setTotalPrice(car.price * days);
        
        // Verificar disponibilidad
        checkAvailability(startDate, endDate);
      }
    }
  }, [startDate, endDate, car]);

  // 3. Verificar disponibilidad
  const checkAvailability = async (start, end) => {
    try {
      const response = await fetch(
        `${API_RESERVATIONS_URL}/availability?carId=${id}&startDate=${start}&endDate=${end}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailability(data.isAvailable);
      }
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
    }
  };

  // 4. Manejar la creación de la reserva
  const handleCreateReservation = async () => {
    if (!startDate || !endDate) {
      alert('Por favor selecciona las fechas de alquiler');
      return;
    }

    if (totalDays < 1) {
      alert('El período mínimo de alquiler es 1 día');
      return;
    }

    if (availability === false) {
      alert('El auto no está disponible en las fechas seleccionadas');
      return;
    }

    setProcessing(true);

    try {
      const reservationData = {
        userId: user.id,
        carId: parseInt(id),
        startDate,
        endDate
      };

      const response = await fetch(API_RESERVATIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Reserva confirmada!\n${data.message}\nTotal: $${totalPrice.toLocaleString()}`);
        router.push('/mis-reservas');
      } else {
        alert(`❌ Error: ${data.message || 'No se pudo crear la reserva'}`);
      }
    } catch (error) {
      console.error('Error creando reserva:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !car) {
    return <div style={{padding:'40px', textAlign:'center'}}>Cargando datos del auto...</div>;
  }

  // Fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reservar {car.brand} {car.model}</h1>
        <span className={styles.priceHighlight}>
          Precio por día: ${parseFloat(car.price).toLocaleString()}
        </span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="startDate">
          Fecha de inicio:
        </label>
        <input 
          type="date" 
          id="startDate"
          value={startDate}
          min={today}
          onChange={(e) => setStartDate(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="endDate">
          Fecha de fin:
        </label>
        <input 
          type="date" 
          id="endDate"
          value={endDate}
          min={startDate || today}
          onChange={(e) => setEndDate(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Días de alquiler:</span>
          <span>{totalDays} día{totalDays !== 1 ? 's' : ''}</span>
        </div>
        
        <div className={styles.summaryItem}>
          <span>Precio total:</span>
          <span className={styles.totalPrice}>
            ${totalPrice.toLocaleString()}
          </span>
        </div>

        {availability !== null && (
          <div className={styles.availability}>
            <span>Disponibilidad:</span>
            <span className={availability ? styles.available : styles.notAvailable}>
              {availability ? '✅ Disponible' : '❌ No disponible'}
            </span>
          </div>
        )}
      </div>

      <button 
        onClick={handleCreateReservation}
        disabled={processing || availability === false}
        className={`${styles.confirmButton} ${
          availability === false ? styles.disabledButton : ''
        }`}
      >
        {processing ? 'Procesando reserva...' : 'CONFIRMAR RESERVA'}
      </button>
    </div>
  );
}