// src/app/admin/autos/crear/page.jsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_CONFIG } from '@/config/config';
import styles from './crear-auto.module.css';

// ✅ CORRECTO: Usa API_CARS_URL directamente
const API_CARS_URL = API_CONFIG.API_CARS_URL;

export default function CrearAutoPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    price: '',
    description: '',
    imageUrl: '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validación adicional en el frontend
      if (!formData.brand.trim() || !formData.model.trim() || !formData.price) {
        throw new Error('Marca, modelo y precio son requeridos');
      }

      if (parseFloat(formData.price) <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      const res = await fetch(API_CARS_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) // Convertir a número
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
      }

      const createdCar = await res.json();
      console.log('Auto creado:', createdCar);
      
      alert('¡Auto creado exitosamente!');
      router.push('/admin/autos');

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al crear el auto: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Crear Nuevo Auto</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
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
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="imageUrl" className={styles.label}>URL de Imagen</label>
            <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={styles.input} />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Descripción</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={styles.textarea} rows="4" />
        </div>

        <div className={styles.actionButtons}>
          <button type="submit" className={styles.saveButton} disabled={saving}>
            {saving ? 'Creando...' : 'Crear Auto'}
          </button>
          <button type="button" className={styles.cancelButton} onClick={() => router.push('/admin/autos')} disabled={saving}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}