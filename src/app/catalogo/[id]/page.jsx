export default async function DetalleAuto({ params }) {
  // Aseguramos que params esté disponible
  const { id } = await params

  const autos = [
    { id: 1, marca: "Toyota", modelo: "Corolla", anio: 2022, precio: 22000, descripcion: "Un sedán confiable, económico y con excelente rendimiento." },
    { id: 2, marca: "Ford", modelo: "Focus", anio: 2021, precio: 21000, descripcion: "Deportivo y ágil, ideal para conducción urbana." },
    { id: 3, marca: "Chevrolet", modelo: "Cruze", anio: 2023, precio: 25000, descripcion: "Tecnología avanzada y gran confort interior." },
    { id: 4, marca: "Volkswagen", modelo: "Golf", anio: 2020, precio: 20000, descripcion: "Compacto y elegante, excelente balance entre potencia y consumo." },
  ]

  const auto = autos.find((a) => a.id.toString() === id)

  if (!auto) {
    return <h2 style={{ padding: "2rem" }}>Auto no encontrado 🚫</h2>
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>
        {auto.marca} {auto.modelo} ({auto.anio})
      </h1>
      <p style={{ fontSize: "1.2rem" }}>{auto.descripcion}</p>
      <h3>Precio: ${auto.precio.toLocaleString()}</h3>
      <a href="/catalogo" style={{ display: "inline-block", marginTop: "1.5rem", color: "#0070f3" }}>
        ← Volver al catálogo
      </a>
    </main>
  )
}