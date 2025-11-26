'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './reservas.module.css';
import { API_CONFIG } from '@/config/config';

const API_RESERVATIONS_URL = API_CONFIG.API_RESERVATIONS_URL;

export default function AdminReservasPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_RESERVATIONS_URL}/all`);
      if (res.ok) {
        const data = await res.json();
        setReservations(data.reservations || data);
      }
    } catch (error) {
      console.error('Error al obtener reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { label: 'Confirmada', class: styles.statusConfirmed },
      active: { label: 'Activa', class: styles.statusActive },
      cancelled: { label: 'Cancelada', class: styles.statusCancelled },
      completed: { label: 'Completada', class: styles.statusCompleted }
    };
    
    const config = statusConfig[status] || { label: status, class: styles.statusUnknown };
    return <span className={`${styles.statusBadge} ${config.class}`}>{config.label}</span>;
  };

  // ✅ FUNCIÓN ACTUALIZADA - Ahora también refresca las fechas bloqueadas
  const cancelReservation = async (reservationId) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      // 1. Cancelar la reserva
      const response = await fetch(`${API_RESERVATIONS_URL}/${reservationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la reserva');
      }

      // 2. ✅ IMPORTANTE: Refrescar las fechas bloqueadas del auto
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation && reservation.carId) {
        await refreshBlockedDates(reservation.carId);
      }

      alert('Reserva cancelada exitosamente. Las fechas ahora están disponibles.');
      fetchReservations(); // Recargar la lista
    } catch (error) {
      console.error('Error al cancelar reserva:', error);
      alert('Error al cancelar la reserva: ' + error.message);
    }
  };

  // ✅ NUEVA FUNCIÓN: Refrescar fechas bloqueadas del auto
  const refreshBlockedDates = async (carId) => {
    try {
      console.log('🔄 Refrescando fechas bloqueadas para auto:', carId);
      
      // Hacer una llamada a la ruta de blocked-dates para forzar la actualización
      const response = await fetch(`${API_RESERVATIONS_URL}/car/${carId}/blocked-dates`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Fechas bloqueadas actualizadas:', data.blockedDates);
        
        // Aquí podrías notificar a otros componentes si es necesario
        // Por ejemplo, usando un contexto global o eventos personalizados
        dispatchBlockedDatesUpdate(carId, data.blockedDates);
      }
    } catch (error) {
      console.error('❌ Error refrescando fechas bloqueadas:', error);
    }
  };

  // ✅ OPCIONAL: Disparar evento personalizado para notificar a otros componentes
  const dispatchBlockedDatesUpdate = (carId, blockedDates) => {
    // Crear un evento personalizado que otros componentes puedan escuchar
    const event = new CustomEvent('blockedDatesUpdated', {
      detail: { carId, blockedDates }
    });
    window.dispatchEvent(event);
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  if (loading) {
    return <div className={styles.loadingContainer}>Cargando reservas...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Reservas</h1>
          <p className={styles.subtitle}>
            Administra todas las reservas del sistema - Total: {reservations.length}
          </p>
        </div>
        <Link href="/admin" className={styles.backButton}>
          ← Volver al Dashboard
        </Link>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <button 
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({reservations.length})
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'confirmed' ? styles.active : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmadas ({reservations.filter(r => r.status === 'confirmed').length})
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'active' ? styles.active : ''}`}
          onClick={() => setFilter('active')}
        >
          Activas ({reservations.filter(r => r.status === 'active').length})
        </button>
        <button 
          className={`${styles.filterButton} ${filter === 'cancelled' ? styles.active : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Canceladas ({reservations.filter(r => r.status === 'cancelled').length})
        </button>
      </div>

      {/* Tabla de Reservas */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Auto</th>
              <th>Usuario</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Días</th>
              <th>Precio Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="9" className={styles.noData}>
                  No hay reservas {filter !== 'all' ? `con estado "${filter}"` : ''}
                </td>
              </tr>
            ) : (
              filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className={styles.idCell}>#{reservation.id}</td>
                  <td>
                    <div className={styles.carInfo}>
                      <strong>{reservation.car?.brand} {reservation.car?.model}</strong>
                      <small>ID: {reservation.carId}</small>
                    </div>
                  </td>
                  <td>
                    <div className={styles.userInfo}>
                      <strong>{reservation.user?.name}</strong>
                      <small>{reservation.user?.email}</small>
                    </div>
                  </td>
                  <td>{formatDate(reservation.startDate)}</td>
                  <td>{formatDate(reservation.endDate)}</td>
                  <td>{reservation.totalDays} días</td>
                  <td>${reservation.totalPrice}</td>
                  <td>{getStatusBadge(reservation.status)}</td>
                  <td>
                    <div className={styles.actions}>
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => cancelReservation(reservation.id)}
                          className={styles.cancelButton}
                          title="Cancelar reserva"
                        >
                          Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/admin/reservas/${reservation.id}`)}
                        className={styles.detailsButton}
                        title="Ver detalles"
                      >
                        Detalles
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}