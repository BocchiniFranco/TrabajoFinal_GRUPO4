// detalle-auto/page.js
import Link from 'next/link';
import { API_CONFIG } from '@/config/config';    
import styles from './detalle-auto.module.css'; 

const API_CARS_URL = API_CONFIG.API_CARS_URL;
const API_RESERVATIONS_URL = 'http://localhost:3001/reservations';

async function getCarAvailability(carId) {
  try {
    const res = await fetch(`${API_RESERVATIONS_URL}/car/${carId}/next-available`, {
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
  }
  return null;
}

export default async function DetalleAuto({ params }) {
  const { id } = await params; 

  if (!id) {
    return <h2 className={styles.container}>Error: ID de auto no proporcionado 🚫</h2>
  }

  const API_CAR_DETAIL_URL = `${API_CARS_URL}/${id}`;
  let auto = null;
  let availability = null;

  try {
    const [carRes, availabilityRes] = await Promise.all([
      fetch(API_CAR_DETAIL_URL, { cache: 'no-store' }),
      getCarAvailability(id)
    ]);

    if (!carRes.ok) throw new Error(`Auto con ID ${id} no encontrado.`); 
    
    auto = await carRes.json();
    availability = availabilityRes;

  } catch (error) {
    console.error(`Error al obtener el auto ${id}:`, error);
    return <h2 className={styles.container}>Error de conexión con la API</h2>
  }

  if (!auto || !auto.id) {
    return <h2 className={styles.container}>Auto con ID {id} no existe 🚫</h2>
  }

  const isAvailable = availability?.isAvailable ?? true;
  const nextAvailableDate = availability?.nextAvailableDate;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{auto.brand} {auto.model}</h1>
        <p className={styles.subtitle}>¡Descubre más sobre este increíble vehículo!</p>
      </div>

      {auto.imageUrl && (
        <div className={styles.imageContainer}>
          <img 
            src={auto.imageUrl} 
            alt={`${auto.brand} ${auto.model}`} 
            className={styles.carImage}
          />
        </div>
      )}
      
      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <p className={styles.detailItem}><span>Marca:</span> {auto.brand}</p>
          <p className={styles.detailItem}><span>Modelo:</span> {auto.model}</p>
          <p className={styles.detailItem}><span>Precio por día:</span> ${parseFloat(auto.price).toLocaleString()}</p>
          <p className={`${styles.detailItem} ${isAvailable ? styles.statusAvailable : styles.statusRented}`}>
            <span>Estado:</span> {isAvailable ? '✅ Disponible para Alquiler' : '❌ Actualmente Alquilado'}
          </p>
          {!isAvailable && nextAvailableDate && (
            <p className={styles.detailItem}>
              <span>Disponible a partir del:</span> {new Date(nextAvailableDate).toLocaleDateString()}
            </p>
          )}
          {!isAvailable && !nextAvailableDate && (
            <p className={styles.detailItem}>
              <span>Próxima disponibilidad:</span> Consultar fechas
            </p>
          )}
        </div>
      </div>

      <p className={styles.description}>
        <span>Descripción:</span> {auto.description || "Este es un vehículo excepcional..."}
      </p>

      <div className={styles.actions}>
        <Link 
          href={isAvailable ? `/catalogo/${id}/alquilar` : '#'}
          className={isAvailable ? styles.reserveButton : styles.disabledButton}
        >
          {isAvailable ? '🗓️ Reservar Este Auto' : '❌ No Disponible'}
        </Link>
        
        <Link href="/catalogo" className={styles.backButton}>
          ← Volver al catálogo
        </Link>
      </div>
    </main>
  )
}