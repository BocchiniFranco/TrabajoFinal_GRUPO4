import CarCard from '../../Components/CarCard';
import styles from './catalogo.module.css';
import { API_CONFIG } from '@/config/config';

const API_CARS_URL = API_CONFIG.API_CARS_URL;

async function getCars() { 
  try {
    const res = await fetch(API_CARS_URL, { cache: 'no-store' }); 
    if (!res.ok) {
      throw new Error(`Fallo al obtener los datos del catálogo: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching cars:", error);
    return []; 
  }
}
// ...

export default async function CatalogoPage() {
  const autos = await getCars();
  
  if (autos.length === 0) {
    return (
      <main className={`${styles.mainContainer} ${styles.noDataContainer}`}>
        <h1 className={styles.title}>Catálogo de Autos</h1>
        <p>No se encontraron autos o hubo un error de conexión.</p>
      </main>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.title}>Catálogo de Autos</h1>
      
      <ul className={styles.list}>
        {autos.map((auto) => (
          <li key={auto.id} className={styles.listItem}>
            <CarCard auto={auto} />
          </li>
        ))}
      </ul>
    </main>
  )
}