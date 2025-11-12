'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function GestionAutos() {
  const { user } = useAuth(); // Validación de rol
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutos();
  }, []);

  const fetchAutos = async () => {
    try {
      const response = await fetch('/api/autos');
      if (response.ok) {
        const data = await response.json();
        setAutos(data);
      }
    } catch (error) {
      console.error('Error al obtener autos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibilidad = async (id, visible) => {
    try {
      await fetch(`/api/autos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !visible }),
      });
      fetchAutos(); // Refresca la lista
    } catch (error) {
      console.error('Error al actualizar visibilidad:', error);
    }
  };

  if (loading) return <p>Cargando autos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Autos</h1>
      <div className="space-y-4">
        {autos.map((auto) => (
          <div
            key={auto.id}
            className="border rounded p-4 flex justify-between items-center bg-white shadow"
          >
            <div>
              <h2 className="font-semibold">
                {auto.marca} {auto.modelo} ({auto.año})
              </h2>
              <p>${auto.precio}</p>
              <p style={{ color: auto.visible ? 'green' : 'red' }}>
                {auto.visible ? 'Visible' : 'Oculto'}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/admin/autos/${auto.id}`}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Editar
              </Link>
              <button
                onClick={() => toggleVisibilidad(auto.id, auto.visible)}
                className={`px-3 py-1 rounded ${
                  auto.visible ? 'bg-yellow-500' : 'bg-green-600'
                } text-white`}
              >
                {auto.visible ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
