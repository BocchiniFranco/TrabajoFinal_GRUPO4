import Link from 'next/link';
import { API_CONFIG } from '@/config/config';

export default async function DetalleAuto({ params }) {

  const { id } = await params; 
  
  // Si el ID sigue siendo nulo, retornamos un error
  if (!id) {
    return <h2 style={{ padding: "2rem" }}>Error: ID de auto no proporcionado 🚫</h2>
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
        return <h2 style={{ padding: "2rem" }}>{error.message} 🚫</h2>
    }
    return <h2 style={{ padding: "2rem" }}>Error de conexión con la API o el auto no existe.</h2>
  }

  // Verificar si la API devolvió un objeto vacío o nulo
  if (!auto || !auto.id) {
    return <h2 style={{ padding: "2rem" }}>Auto con ID {id} no existe 🚫</h2>
  }

  // Renderizado final
  return (
    <main style={{ padding: "2rem" }}>
      <h1>
        {auto.brand} {auto.model} 
      </h1>
      
      <h3>
        Precio: ${parseFloat(auto.price).toLocaleString()}
      </h3>
      
      <Link href="/catalogo" style={{ display: "inline-block", marginTop: "1.5rem", color: "#0070f3" }}>
        ← Volver al catálogo
      </Link>
    </main>
  )
}