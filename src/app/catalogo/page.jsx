// app/catalogo/page.jsx
import Link from "next/link";

const API_CARS_URL = "https://690aa7dc1a446bb9cc234227.mockapi.io/cars";

// Función de Componente de Servidor (Async) para obtener los datos
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

export default async function CatalogoPage() {
  const autos = await getCars();
  
  if (autos.length === 0) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Catálogo de Autos</h1>
        <p>No se encontraron autos o hubo un error de conexión.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Catálogo de Autos</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {autos.map((auto) => (
          <li key={auto.id} style={{ marginBottom: "1rem" }}>
            <Link href={`/catalogo/${auto.id}`}>
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                <h2>
                  {/* Para la base intentemos usar los mismas en ingles */}
                  {auto.brand} {auto.model} 
                </h2>
                <p>
                  Precio: ${parseFloat(auto.price).toLocaleString()}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}