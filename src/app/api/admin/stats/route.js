// app/api/admin/stats/route.js

// URL del MockAPI (la misma que usa tu catálogo)
const API_CARS_URL = "https://690aa7dc1a446bb9cc234227.mockapi.io/cars";

export async function GET() {
  try {
    // Obtenemos todos los autos del MockAPI
    const res = await fetch(API_CARS_URL, { cache: "no-store" });

    if (!res.ok) {
      return Response.json(
        { error: "Error al obtener los autos" },
        { status: 500 }
      );
    }

    const autos = await res.json();

    // Verificamos si existe el campo 'visible'
    // Si no existe, asumimos que todos son visibles
    const totalAutos = autos.length;
    const autosVisibles = autos.filter((a) => a.visible === true).length;
    const autosOcultos = totalAutos - autosVisibles;

    // Devolvemos las estadísticas
    return Response.json({
      totalAutos,
      autosVisibles,
      autosOcultos,
    });
  } catch (error) {
    console.error("Error en /api/admin/stats:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}