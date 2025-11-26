// components/RentalCalendar.jsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './RentalCalendar.module.css';

const RentalCalendar = ({ blockedDates = [], onDateSelect, selectedStartDate, selectedEndDate, carId }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('start');
  const [localBlockedDates, setLocalBlockedDates] = useState(blockedDates);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ✅ EFECTO PARA SINCRONIZAR blockedDates PROPS
  useEffect(() => {
    setLocalBlockedDates(blockedDates);
  }, [blockedDates]);

  // ✅ LISTENER PARA ACTUALIZACIONES DE FECHAS BLOQUEADAS
  useEffect(() => {
    const handleBlockedDatesUpdate = (event) => {
      const { carId: updatedCarId, blockedDates: newBlockedDates } = event.detail;
      
      console.log('🔄 Calendario recibió evento:', updatedCarId, newBlockedDates);
      
      // Si este calendario muestra el auto afectado, actualizar las fechas
      if (updatedCarId === carId) {
        console.log('✅ Actualizando fechas bloqueadas para este calendario');
        setLocalBlockedDates(newBlockedDates);
      }
    };

    window.addEventListener('blockedDatesUpdated', handleBlockedDatesUpdate);

    return () => {
      window.removeEventListener('blockedDatesUpdated', handleBlockedDatesUpdate);
    };
  }, [carId]); // Depende de carId para saber si este calendario debe actualizarse

  // Navegación del calendario
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Verificar si una fecha está bloqueada (usa localBlockedDates)
  const isDateBlocked = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return localBlockedDates.includes(dateString);
  };

  // Verificar si una fecha está seleccionada
  const isDateSelected = (date) => {
    if (!selectedStartDate) return false;
    
    const dateString = date.toISOString().split('T')[0];
    const startString = selectedStartDate.toISOString().split('T')[0];
    
    if (!selectedEndDate) {
      return dateString === startString;
    }
    
    const endString = selectedEndDate.toISOString().split('T')[0];
    return dateString >= startString && dateString <= endString;
  };

  // Manejar clic en una fecha
  const handleDateClick = (date) => {
    if (isDateBlocked(date)) {
      console.log('❌ Fecha bloqueada, no se puede seleccionar:', date.toISOString().split('T')[0]);
      return;
    }
    
    console.log('✅ Fecha seleccionada:', date.toISOString().split('T')[0]);
    
    if (view === 'start') {
      onDateSelect(date, null);
      setView('end');
    } else {
      if (date >= selectedStartDate) {
        onDateSelect(selectedStartDate, date);
      } else {
        onDateSelect(date, selectedStartDate);
      }
    }
  };

  // Generar el calendario
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const calendar = [];
    
    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
      const date = new Date(year, month - 1, prevMonthLastDay - startingDay + i + 1);
      calendar.push({
        date,
        isCurrentMonth: false,
        isBlocked: false,
        isSelectable: false
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isBlocked = isDateBlocked(date);
      calendar.push({
        date,
        isCurrentMonth: true,
        isBlocked: isBlocked,
        isSelectable: !isBlocked && date >= today
      });
    }
    
    // Días del siguiente mes
    const totalCells = 42;
    const remainingCells = totalCells - calendar.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      calendar.push({
        date,
        isCurrentMonth: false,
        isBlocked: false,
        isSelectable: false
      });
    }
    
    return calendar;
  };

  const calendarDays = generateCalendar();
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'];

  // Debug info (opcional)
  console.log('📅 Calendario - Fechas bloqueadas:', localBlockedDates.length);
  console.log('📅 Calendario - Car ID:', carId);

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button onClick={goToPreviousMonth} className={styles.navButton}>
          ‹
        </button>
        <h3 className={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={goToNextMonth} className={styles.navButton}>
          ›
        </button>
      </div>

      <div className={styles.weekDays}>
        {dayNames.map(day => (
          <div key={day} className={styles.weekDay}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {calendarDays.map((day, index) => {
          const isToday = day.date.toDateString() === today.toDateString();
          const isSelected = isDateSelected(day.date);
          const isBlocked = day.isBlocked;
          
          let dayClass = styles.calendarDay;
          if (!day.isCurrentMonth) dayClass += ` ${styles.otherMonth}`;
          if (isBlocked) dayClass += ` ${styles.blocked}`;
          if (isToday) dayClass += ` ${styles.today}`;
          if (isSelected) dayClass += ` ${styles.selected}`;
          if (day.isSelectable) dayClass += ` ${styles.selectable}`;

          return (
            <button
              key={index}
              className={dayClass}
              onClick={() => day.isSelectable && handleDateClick(day.date)}
              disabled={!day.isSelectable}
              title={isBlocked ? 'Fecha no disponible' : day.isSelectable ? 'Seleccionar fecha' : 'No disponible'}
            >
              {day.date.getDate()}
            </button>
          );
        })}
      </div>

      <div className={styles.calendarControls}>
        <button 
          onClick={() => {
            onDateSelect(null, null);
            setView('start');
          }} 
          className={styles.clearButton}
        >
          Borrar
        </button>
        <button onClick={goToToday} className={styles.todayButton}>
          Hoy
        </button>
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.available}`}></div>
          <span>Disponible</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.blocked}`}></div>
          <span>No disponible</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.selected}`}></div>
          <span>Seleccionado</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.todayLegend}`}></div>
          <span>Hoy</span>
        </div>
      </div>
    </div>
  );
};

export default RentalCalendar;