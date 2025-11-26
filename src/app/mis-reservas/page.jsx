'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './mis-reservas.module.css';
import { API_CONFIG } from '@/config/config';

// Configuración de la API
const API_RESERVATIONS_URL = API_CONFIG.API_RESERVATIONS_URL;

export default function MisReservasPage() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Cargar reservas del usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserReservations();
    }
  }, [isAuthenticated, user]);

  const fetchUserReservations = async () => {
    try {
      console.log('🔍 Cargando reservas para usuario:', user.id);
      const response = await fetch(`${API_RESERVATIONS_URL}/user/${user.id}`);
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Reservas cargadas:', data);
        setReservations(data.reservations || []);
      } else {
        console.error('❌ Error al cargar reservas:', response.status);
        alert('Error al cargar las reservas');
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN ACTUALIZADA: Cancelar reserva y refrescar fechas bloqueadas
  const handleCancelReservation = async (reservationId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    try {
      // 1. Cancelar la reserva
      const response = await fetch(`${API_RESERVATIONS_URL}/${reservationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 2. ✅ IMPORTANTE: Refrescar las fechas bloqueadas del auto
        const reservation = reservations.find(r => r.id === reservationId);
        if (reservation && reservation.carId) {
          await refreshBlockedDates(reservation.carId);
        }

        alert('✅ Reserva cancelada exitosamente. Las fechas ahora están disponibles.');
        fetchUserReservations(); // Recargar la lista
      } else {
        const data = await response.json();
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      alert('Error de conexión');
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
        
        // Notificar a otros componentes sobre la actualización
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

  // Iniciar edición
  const startEditing = (reservation) => {
    setEditingReservation(reservation.id);
    setEditStartDate(reservation.startDate);
    setEditEndDate(reservation.endDate);
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingReservation(null);
    setEditStartDate('');
    setEditEndDate('');
  };

  // ✅ FUNCIÓN ACTUALIZADA: Guardar cambios de edición y refrescar fechas
  const handleSaveEdit = async (reservationId) => {
    if (!editStartDate || !editEndDate) {
      alert('Por favor completa ambas fechas');
      return;
    }

    const start = new Date(editStartDate);
    const end = new Date(editEndDate);
    
    if (end <= start) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    try {
      const response = await fetch(`${API_RESERVATIONS_URL}/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: editStartDate,
          endDate: editEndDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Refrescar fechas bloqueadas después de modificar
        const reservation = reservations.find(r => r.id === reservationId);
        if (reservation && reservation.carId) {
          await refreshBlockedDates(reservation.carId);
        }

        alert('✅ Reserva actualizada exitosamente');
        setEditingReservation(null);
        fetchUserReservations(); // Recargar la lista
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      alert('Error de conexión');
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener el estilo del estado
  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'cancelled':
        return styles.statusCancelled;
      case 'completed':
        return styles.statusCompleted;
      case 'active':
        return styles.statusActive;
      default:
        return styles.statusPending;
    }
  };

  // Función para traducir el estado
  const translateStatus = (status) => {
    const statusMap = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'active': 'Activa',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Verificando autenticación...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingText}>Cargando tus reservas...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mis Reservas</h1>
        <p className={styles.subtitle}>
          Gestiona y revisa el estado de tus reservas de autos
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No tienes reservas aún</h2>
          <p>¡Encuentra el auto perfecto y haz tu primera reserva!</p>
          <Link href="/catalogo" className={styles.ctaButton}>
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className={styles.reservationsGrid}>
          {reservations.map((reservation) => (
            <div key={reservation.id} className={styles.reservationCard}>
              <div className={styles.carImage}>
                {reservation.car?.imageUrl ? (
                  <img 
                    src={reservation.car.imageUrl} 
                    alt={`${reservation.car.brand} ${reservation.car.model}`}
                  />
                ) : (
                  <div className={styles.noImage}>🚗</div>
                )}
              </div>
              
              <div className={styles.reservationInfo}>
                <h3 className={styles.carName}>
                  {reservation.car?.brand} {reservation.car?.model}
                </h3>
                
                <div className={styles.dates}>
                  <p><strong>Desde:</strong> {formatDate(reservation.startDate)}</p>
                  <p><strong>Hasta:</strong> {formatDate(reservation.endDate)}</p>
                  <p><strong>Días:</strong> {reservation.totalDays}</p>
                </div>
                
                <div className={styles.price}>
                  <strong>Total:</strong> ${reservation.totalPrice?.toLocaleString() || '0'}
                </div>
                
                <div className={styles.status}>
                  <span className={getStatusStyle(reservation.status)}>
                    {translateStatus(reservation.status)}
                  </span>
                </div>

                {/* Formulario de edición */}
                {editingReservation === reservation.id ? (
                  <div className={styles.editForm}>
                    <div className={styles.editInputs}>
                      <input
                        type="date"
                        value={editStartDate}
                        onChange={(e) => setEditStartDate(e.target.value)}
                        className={styles.dateInput}
                      />
                      <input
                        type="date"
                        value={editEndDate}
                        min={editStartDate}
                        onChange={(e) => setEditEndDate(e.target.value)}
                        className={styles.dateInput}
                      />
                    </div>
                    <div className={styles.editActions}>
                      <button 
                        onClick={() => handleSaveEdit(reservation.id)}
                        className={styles.saveButton}
                      >
                        Guardar
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className={styles.cancelEditButton}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Acciones normales */
                  <div className={styles.actions}>
                    {reservation.status === 'confirmed' && (
                      <>
                        <button 
                          onClick={() => startEditing(reservation)}
                          className={styles.editButton}
                        >
                          Modificar Fechas
                        </button>
                        <button 
                          onClick={() => handleCancelReservation(reservation.id)}
                          className={styles.cancelButton}
                        >
                          Cancelar Reserva
                        </button>
                      </>
                    )}
                    {reservation.status === 'cancelled' && (
                      <span className={styles.cancelledText}>Reserva cancelada</span>
                    )}
                    {reservation.status === 'completed' && (
                      <span className={styles.completedText}>Reserva completada</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}