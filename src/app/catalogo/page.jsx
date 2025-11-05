import Link from "next/link"

export default function CatalogoPage() {
  const autos = [
    { id: 1, marca: "Toyota", modelo: "Corolla", anio: 2022, precio: 22000 },
    { id: 2, marca: "Ford", modelo: "Focus", anio: 2021, precio: 21000 },
    { id: 3, marca: "Chevrolet", modelo: "Cruze", anio: 2023, precio: 25000 },
    { id: 4, marca: "Volkswagen", modelo: "Golf", anio: 2020, precio: 20000 },
  ]

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
                  {auto.marca} {auto.modelo} ({auto.anio})
                </h2>
                <p>Precio: ${auto.precio.toLocaleString()}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}