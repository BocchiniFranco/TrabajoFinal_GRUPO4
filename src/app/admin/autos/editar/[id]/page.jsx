// src/app/admin/autos/editar/[id]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_CONFIG } from '@/config/config';
import styles from './editar.module.css'; // Usaremos un nuevo CSS Module

const API_CARS_URL = API_CONFIG.API_CARS_URL;

export default function EditarAutoPage() {
  const { id } = useParams(); // Obtiene el ID del auto de la URL
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    description: '',
    imageUrl: '',
    isRented: false,
    availableUntil: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Efecto para cargar los datos existentes del auto
  useEffect(() => {
    const fetchAutoData = async () => {
      try {
        const res = await fetch(`${API_CARS_URL}/${id}`);
        if (!res.ok) throw new Error('Auto no encontrado');
        
        const data = await res.json();
        
        // Formatear los datos para el formulario
        setFormData({
          brand: data.brand || '',
          model: data.model || '',
          price: data.price ? parseFloat(data.price) : '', // Asegurar que es número/string
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          isRented: data.isRented || false,
          availableUntil: data.availableUntil ? data.availableUntil.substring(0, 10) : '', // Formatear la fecha
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar datos del auto. Vuelve al inventario.');
        router.push('/admin/autos');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchAutoData();
    }
  }, [id, router]);

  // 2. Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 3. Manejar el envío del formulario (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        ...formData,
        // Convertir la fecha vacía a null si no está alquilado
        availableUntil: formData.isRented && formData.availableUntil ? formData.availableUntil : null,
      };

      const res = await fetch(`${API_CARS_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Fallo al actualizar el auto: ${res.status}`);
      }

      alert('¡Auto actualizado exitosamente!');
      router.push('/admin/autos'); // Volver a la lista de gestión

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando formulario...</div>;
  }
  
  if (!formData.brand) {
      return <div style={styles.error}>No se pudo encontrar el auto con ID: {id}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Auto: {formData.brand} {formData.model}</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Campos Principales */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="brand" className={styles.label}>Marca</label>
            <input type="text" id="brand" name="brand" value={formData.brand} onChange={handleChange} className={styles.input} required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="model" className={styles.label}>Modelo</label>
            <input type="text" id="model" name="model" value={formData.model} onChange={handleChange} className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>Precio por Día ($)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className={styles.input} required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="imageUrl" className={styles.label}>URL de Imagen</label>
            <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={styles.input} />
          </div>
        </div>

        {/* Descripción */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Descripción</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={styles.textarea} rows="4" />
        </div>

        {/* Estado y Disponibilidad */}
        <div className={styles.availabilityGroup}>
          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="isRented" name="isRented" checked={formData.isRented} onChange={handleChange} />
            <label htmlFor="isRented">Marcar como Alquilado</label>
          </div>

          <div className={styles.formGroup} style={{ opacity: formData.isRented ? 1 : 0.5, pointerEvents: formData.isRented ? 'auto' : 'none' }}>
            <label htmlFor="availableUntil" className={styles.label}>Disponible hasta (Fecha de Regreso)</label>
            {/* Usamos el tipo date de HTML y el valor formateado */}
            <input type="date" id="availableUntil" name="availableUntil" value={formData.availableUntil} onChange={handleChange} className={styles.input} required={formData.isRented} />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className={styles.actionButtons}>
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button type="button" className={styles.cancelButton} onClick={() => router.push('/admin/autos')} disabled={saving}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

