import Link from 'next/link';
import { API_CONFIG } from '@/config/config';    
import styles from './detalle-auto.module.css'; 

const API_CARS_URL = API_CONFIG.API_CARS_URL;

// Componente de Servidor (Async) para obtener los detalles del auto
export default async function DetalleAuto({ params }) {

  const { id } = await params; 

  if (!id) {
    return <h2 className={styles.container} style={{ color: '#dc3545' }}>Error: ID de auto no proporcionado 🚫</h2>
  }

  const API_CAR_DETAIL_URL = `${API_CARS_URL}/${id}`;
  let auto = null;

  try {
    const res = await fetch(API_CAR_DETAIL_URL, { cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Auto con ID ${id} no encontrado.`); 
    }

    auto = await res.json();

  } catch (error) {
    console.error(`Error al obtener el auto ${id}:`, error);
    if (error.message.includes("no encontrado")) {
        return <h2 className={styles.container} style={{ color: '#dc3545' }}>Auto no encontrado.</h2>
    }
    return <h2 className={styles.container} style={{ color: '#dc3545' }}>Error de conexión con la API o el auto no existe.</h2>
  }

  if (!auto || !auto.id) {
    return <h2 className={styles.container} style={{ color: '#dc3545' }}>Auto con ID {id} no existe 🚫</h2>
  }

  // Renderizado final
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {auto.brand} {auto.model} 
        </h1>
        <p className={styles.subtitle}>
          ¡Descubre más sobre este increíble vehículo!
        </p>
      </div>

      {auto.imageUrl && (
        <div className={styles.imageContainer}>
          <img 
            src={auto.imageUrl} 
            alt={`${auto.brand} ${auto.model}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
      )}
      
      <div className={styles.detailsGrid}>
        <div className={styles.detailCard}>
          <p className={styles.detailItem}><span>Marca:</span> {auto.brand}</p>
          <p className={styles.detailItem}><span>Modelo:</span> {auto.model}</p>
          <p className={styles.detailItem}><span>Precio por día:</span> ${parseFloat(auto.price).toLocaleString()}</p>
          <p className={`${styles.detailItem} ${auto.isRented ? styles.statusRented : styles.statusAvailable}`}>
            <span>Estado:</span> {auto.isRented ? '❌ Actualmente Alquilado' : '✅ Disponible para Alquiler'}
          </p>
          {auto.isRented && auto.availableUntil && (
              <p className={styles.detailItem}>
                  <span>Regresa el:</span> {new Date(auto.availableUntil).toLocaleDateString()}
              </p>
          )}
        </div>
      </div>

      <p className={styles.description}>
        <span>Descripción:</span> {auto.description || "Este es un vehículo excepcional, con todas las comodidades y un rendimiento inigualable. Ideal para cualquier aventura, ya sea en la ciudad o en carretera. Contáctanos para más detalles sobre su alquiler."}
      </p>

      {/* ✅ NUEVO: Botón de Reservar */}
      <div className={styles.actions}>
        <Link 
          href={`/catalogo/${id}/alquilar`}
          className={styles.reserveButton}
        >
          🗓️ Reservar Este Auto
        </Link>
        
        <Link 
          href="/catalogo" 
          className={styles.backLink}
        >
          ← Volver al catálogo
        </Link>
      </div>
    </main>
  )
}