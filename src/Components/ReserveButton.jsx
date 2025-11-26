'use client';

import Link from 'next/link';
import styles from './ReserveButton.module.css';

export default function ReserveButton({ isAvailable, carId }) {
  if (!isAvailable) {
    return (
      <button className={styles.disabledButton} disabled>
        ❌ No Disponible
      </button>
    );
  }

  return (
    <Link 
      href={`/catalogo/${carId}/alquilar`}
      className={styles.reserveButton}
    >
      🗓️ Reservar Este Auto
    </Link>
  );
}