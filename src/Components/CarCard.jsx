// src/Components/CarCard.jsx
'use client'; 

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../app/catalogo/catalogo.module.css';

// Componente de Cliente para la tarjeta interactiva
export default function CarCard({ auto }) {
  const router = useRouter();
  const handleRentClick = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    if (!auto.isRented) {
        //alert(`Intentando alquilar el ${auto.model}...`);
        router.push(`/catalogo/${auto.id}/alquilar`);
    }
  };

  return (
    <Link href={`/catalogo/${auto.id}`} className={styles.link}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          {auto.imageUrl ? (
            <img 
              src={auto.imageUrl} 
              alt={`${auto.brand} ${auto.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span>[Sin Imagen] 📸</span> 
          )}
        </div>
        
        <h2 className={styles.carTitle}>
          {auto.brand} {auto.model} 
        </h2>
        <p className={styles.price}>
          Precio: ${parseFloat(auto.price).toLocaleString()}
        </p>
        
        <button 
          className={`${styles.rentButton} ${auto.isRented ? styles.rentedButton : ''}`}
          onClick={handleRentClick}
          disabled={auto.isRented}
        >
          {auto.isRented ? 
            `ALQUILADO hasta ${auto.availableUntil ? new Date(auto.availableUntil).toLocaleDateString() : 'Fecha Desconocida'}` 
            : 
            'ALQUILAR AHORA'
          }
        </button>
        
      </div>
    </Link>
  );
}