// src/app/admin/autos/editar/[id]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { API_CONFIG } from '@/config/config';
import styles from './editar.module.css';

const API_CARS_URL = API_CONFIG.API_CARS_URL;

export default function EditarAutoPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // 1. Efecto para cargar los datos existentes del auto
  useEffect(() => {
    const fetchAutoData = async () => {
      try {
        const res = await fetch(`${API_CARS_URL}/${id}`);
        if (!res.ok) throw new Error('Auto no encontrado');
        
        const data = await res.json();
        
        // Formatear los datos para el formulario - SOLO campos básicos
        setFormData({
          brand: data.brand || '',
          model: data.model || '',
          price: data.price ? data.price.toString() : '', // Mantener como string para el input
          description: data.description || '',
          imageUrl: data.imageUrl || '',
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar datos del auto. Vuelve al inventario.');
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3. Manejar el envío del formulario (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validaciones
      if (!formData.brand.trim() || !formData.model.trim() || !formData.price) {
        throw new Error('Marca, modelo y precio son requeridos');
      }

      if (parseFloat(formData.price) <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      // Solo enviar los campos básicos, no isRented ni availableUntil
      const payload = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim() || null,
      };

      const res = await fetch(`${API_CARS_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      alert('¡Auto actualizado exitosamente!');
      router.push('/admin/autos');

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Estados de carga y error
  if (loading) {
    return <div className={styles.loading}>Cargando formulario...</div>;
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button 
          onClick={() => router.push('/admin/autos')} 
          className={styles.backButton}
        >
          Volver al Inventario
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Auto: {formData.brand} {formData.model}</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Campos Principales */}
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="brand" className={styles.label}>Marca *</label>
            <input 
              type="text" 
              id="brand" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              className={styles.input} 
              required 
              placeholder="Ej: Toyota"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="model" className={styles.label}>Modelo *</label>
            <input 
              type="text" 
              id="model" 
              name="model" 
              value={formData.model} 
              onChange={handleChange} 
              className={styles.input} 
              required 
              placeholder="Ej: Corolla"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price" className={styles.label}>Precio por Día ($) *</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              className={styles.input} 
              required 
              min="0" 
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="imageUrl" className={styles.label}>URL de Imagen</label>
            <input 
              type="text" 
              id="imageUrl" 
              name="imageUrl" 
              value={formData.imageUrl} 
              onChange={handleChange} 
              className={styles.input} 
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Descripción</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            className={styles.textarea} 
            rows="4" 
            placeholder="Descripción detallada del auto..."
          />
        </div>

        {/* Información sobre estado de alquiler */}
        <div className={styles.infoBox}>
          <h3 className={styles.infoTitle}>Información sobre Alquiler</h3>
          <p className={styles.infoText}>
            El estado de alquiler (disponible/alquilado) se gestiona automáticamente 
            a través del sistema de reservas. Para liberar un auto alquilado, 
            usa la opción "LIBERAR" en la lista de gestión.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className={styles.actionButtons}>
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={() => router.push('/admin/autos')} 
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}