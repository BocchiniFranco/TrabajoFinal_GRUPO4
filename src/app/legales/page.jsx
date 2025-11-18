// app/legales/page.jsx
import React from 'react';
import styles from './legales.module.css'; 

export default function LegalesPage() {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Términos y Políticas Legales ⚖️</h1>
      <p style={{marginBottom: '30px', fontSize: '1.1rem'}}>
        Última actualización: 18 de Noviembre de 2025
      </p>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Términos de Servicio (TDS)</h2>
        <p>
          Al utilizar nuestra aplicación de alquiler de autos, usted acepta los siguientes términos y condiciones. Nos reservamos el derecho de modificar o terminar el servicio por cualquier motivo y sin previo aviso, en cualquier momento.
        </p>
        <p>
          <strong>Uso de la Plataforma:</strong> El servicio está destinado únicamente a usuarios mayores de 21 años con licencia de conducir válida y vigente. La gestión del inventario (Crear, Editar, Eliminar autos) está restringida al rol de <strong>&quot;admin&quot;</strong>.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>2. Política de Privacidad</h2>
        <p>
          Respetamos su privacidad. Recopilamos información personal (nombre, email y credenciales de acceso) únicamente para fines de autenticación y reserva. No compartimos sus datos con terceros, excepto cuando sea necesario para procesar transacciones o cumplir con la ley.
        </p>
        <p>
          <strong>Cookies:</strong> Utilizamos cookies para mantener su sesión activa (persistencia de Login). Al usar el sitio, acepta el uso de cookies esenciales.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>3. Limitación de Responsabilidad</h2>
        <p>
          Nuestra empresa no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluida la pérdida de ganancias, que resulten del uso o la imposibilidad de usar el servicio.
        </p>
      </div>
      
      <p className={styles.footerText}>
          Para cualquier pregunta o aclaración, por favor contáctenos a través de nuestro formulario en la página de inicio.
      </p>
    </div>
  );
}