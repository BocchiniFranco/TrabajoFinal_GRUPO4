// alquilar/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_CONFIG } from '@/config/config';
import { useAuth } from '@/contexts/AuthContext';
import RentalCalendar from '@/components/RentalCalendar';
import styles from './alquilar.module.css';

const API_RESERVATIONS_URL = 'http://localhost:3001/reservations';

export default function AlquilarPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [car, setCar] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener las fechas bloqueadas con manejo de errores
  const fetchBlockedDates = async (carId) => {
    try {
      console.log('🔄 Fetching blocked dates for car:', carId);
      const response = await fetch(`${API_RESERVATIONS_URL}/car/${carId}/blocked-dates`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Blocked dates received:', data.blockedDates);
        setBlockedDates(data.blockedDates || []);
        setError(null);
      } else {
        const errorData = await response.json();
        console.error('❌ Error fetching blocked dates:', errorData);
        setError('Error al cargar fechas no disponibles');
        setBlockedDates([]);
      }
    } catch (error) {
      console.error('❌ Network error fetching blocked dates:', error);
      setError('Error de conexión al cargar fechas');
      setBlockedDates([]);
    }
  };

  // 1. Cargar datos del auto y fechas bloqueadas
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
          await fetchBlockedDates(id);
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
      
      if (end >= start) {
        const timeDiff = end.getTime() - start.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        setTotalDays(days);
        setTotalPrice(car.price * days);
        checkAvailability(startDate, endDate);
      } else {
        setTotalDays(0);
        setTotalPrice(0);
        setAvailability(null);
      }
    }
  }, [startDate, endDate, car]);

  // 3. Verificar disponibilidad
  const checkAvailability = async (start, end) => {
    try {
      const startString = start.toISOString().split('T')[0];
      const endString = end.toISOString().split('T')[0];
      
      const response = await fetch(
        `${API_RESERVATIONS_URL}/availability?carId=${id}&startDate=${startString}&endDate=${endString}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailability(data.isAvailable);
      }
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      setAvailability(null);
    }
  };

  // 4. Manejar selección de fechas desde el calendario
  const handleDateSelect = (start, end) => {
    console.log('📅 Date selected:', start, end);
    setStartDate(start);
    setEndDate(end);
  };

  // 5. Verificar si hay fechas bloqueadas en el rango seleccionado
  const hasBlockedDatesInRange = () => {
    if (!startDate || !endDate) return false;

    const selectedStart = new Date(startDate);
    const selectedEnd = new Date(endDate);
    let currentDate = new Date(selectedStart);
    
    while (currentDate <= selectedEnd) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (blockedDates.includes(dateString)) {
        return true;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return false;
  };

  // 6. Manejar la creación de la reserva
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

    if (hasBlockedDatesInRange()) {
      alert('Una o más fechas seleccionadas ya están reservadas');
      return;
    }

    setProcessing(true);

    try {
      const reservationData = {
        userId: user.id,
        carId: parseInt(id),
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        totalPrice,
        status: 'confirmed'
      };

      console.log('📤 Sending reservation:', reservationData);

      const response = await fetch(API_RESERVATIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Reserva confirmada!\nDel ${startDate.toLocaleDateString()} al ${endDate.toLocaleDateString()}\nTotal: $${totalPrice.toLocaleString()}`);
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
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando datos del auto...</p>
      </div>
    );
  }

  const isFormValid = startDate && endDate && availability !== false && !hasBlockedDatesInRange();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reservar {car.brand} {car.model}</h1>
        <span className={styles.priceHighlight}>
          Precio por día: ${parseFloat(car.price).toLocaleString()}
        </span>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error} - Las fechas bloqueadas no se pudieron cargar
        </div>
      )}

      <div className={styles.calendarSection}>
        <RentalCalendar
          blockedDates={blockedDates}
          onDateSelect={handleDateSelect}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
        />
      </div>

      {/* Resumen de la reserva */}
      {startDate && endDate && (
        <div className={styles.summary}>
          <h3>Resumen de tu reserva</h3>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Desde:</span>
              <strong>{startDate.toLocaleDateString()}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Hasta:</span>
              <strong>{endDate.toLocaleDateString()}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Días de alquiler:</span>
              <strong>{totalDays} día{totalDays !== 1 ? 's' : ''}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Precio por día:</span>
              <strong>${parseFloat(car.price).toLocaleString()}</strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Precio total:</span>
              <strong className={styles.totalPrice}>${totalPrice.toLocaleString()}</strong>
            </div>
          </div>

          {availability !== null && (
            <div className={`${styles.availabilityStatus} ${availability ? styles.available : styles.notAvailable}`}>
              {availability ? '✅ Disponible para estas fechas' : '❌ No disponible en las fechas seleccionadas'}
            </div>
          )}

          {hasBlockedDatesInRange() && (
            <div className={styles.notAvailable}>
              ⚠️ Algunas fechas seleccionadas están reservadas
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <button 
          onClick={() => router.push(`/catalogo/${id}`)}
          className={styles.backButton}
        >
          ← Volver al detalle
        </button>
        
        <button 
          onClick={handleCreateReservation}
          disabled={processing || !isFormValid}
          className={`${styles.confirmButton} ${
            processing || !isFormValid ? styles.disabledButton : ''
          }`}
        >
          {processing ? (
            <>
              <div className={styles.spinnerSmall}></div>
              Procesando reserva...
            </>
          ) : (
            'CONFIRMAR RESERVA'
          )}
        </button>
      </div>
    </div>
  );
}