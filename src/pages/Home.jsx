import { useState, useRef } from 'react';
import './styles/Home.css';

export default function PublicHome() {
  // Estados para el calendario
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Referencia para hacer scroll suave hasta la sección de agendar
  const agendarRef = useRef(null);

  const scrollToAgendar = () => {
    agendarRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simulación de carga de horarios desde la API
  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null);
    
    // Aquí harías tu fetch real: fetch(`/api/horarios?dia=${day}`)
    // Simulamos que algunos días tienen más horarios que otros
    const mockSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '04:00 PM', '05:30 PM'];
    // Mezclamos un poco para que varíe según el día
    const randomSlots = mockSlots.filter(() => Math.random() > 0.3);
    
    setAvailableSlots(randomSlots.length > 0 ? randomSlots : ['09:00 AM']); // Al menos 1
  };

  // Días de relleno para cuadrar el mes (ejemplo genérico para el grid)
  const emptyDays = [1, 2, 3]; // Espacios vacíos antes del día 1
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="public-home">
      
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <nav className="navbar">
        <div className="logo-container">
          <i className="ph ph-brain logo-icon"></i>
          <h1 className="logo-text">NeuroClinic</h1>
        </div>
        <div className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#servicios">Servicios</a>
          <button className="btn-nav-agendar" onClick={scrollToAgendar}>
            Agendar Cita
          </button>
        </div>
      </nav>

      {/* --- SECCIÓN HERO (INFORMACIÓN GENERAL) --- */}
      <section id="inicio" className="hero-section">
        <div className="hero-text">
          <span className="badge">Ciencia que comprende</span>
          <h2>Rehabilitación Neuropsicológica <br/><span>para tu bienestar</span></h2>
          <p>
            En NeuroClinic integramos ciencia, empatía y propósito. 
            Ofrecemos evaluaciones precisas y terapias personalizadas para 
            acompañarte en tu desarrollo cognitivo y emocional.
          </p>
          <button className="btn-primary" onClick={scrollToAgendar}>
            <i className="ph ph-calendar-check"></i> Consultar Disponibilidad
          </button>   
        </div>
        <div className="hero-image">
          {/* Aquí iría tu imagen real (puedes usar un img tag) */}
          <div className="image-placeholder">
            <i className="ph ph-users-three"></i>
            <p>Atención integral y empática</p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN SERVICIOS RÁPIDOS --- */}
      <section id="servicios" className="services-section">
        <div className="service-card">
          <i className="ph ph-clipboard-text"></i>
          <h3>Evaluación Cognitiva</h3>
          <p>Diagnóstico preciso de atención, memoria y funciones ejecutivas.</p>
        </div>
        <div className="service-card">
          <i className="ph ph-puzzle-piece"></i>
          <h3>Terapia de Conducta</h3>
          <p>Intervención personalizada para el desarrollo y bienestar emocional.</p>
        </div>
        <div className="service-card">
          <i className="ph ph-heartbeat"></i>
          <h3>Neurorehabilitación</h3>
          <p>Acompañamiento clínico para recuperar el bienestar integral.</p>
        </div>
      </section>

      {/* --- SECCIÓN DEL CALENDARIO (HASTA ABAJO) --- */}
      <section ref={agendarRef} className="booking-section">
        <div className="booking-header">
          <h2>Agenda tu Evaluación</h2>
          <p>Selecciona un día en el calendario para ver los horarios libres.</p>
        </div>

        <div className="booking-container">
          {/* Columna Izquierda: CALENDARIO COMPLETO */}
          <div className="calendar-panel">
            <div className="month-header">
              <button className="icon-btn"><i className="ph ph-caret-left"></i></button>
              <h3>Julio 2026</h3>
              <button className="icon-btn"><i className="ph ph-caret-right"></i></button>
            </div>
            
            <div className="days-of-week">
              <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span>
              <span>Jue</span><span>Vie</span><span>Sáb</span>
            </div>
            
            <div className="calendar-grid">
              {/* Espacios vacíos del inicio del mes */}
              {emptyDays.map(empty => <div key={`empty-${empty}`} className="day-cell empty"></div>)}
              
              {/* Días reales del mes */}
              {daysInMonth.map(day => (
                <button 
                  key={day} 
                  className={`day-cell ${selectedDay === day ? 'selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: HORARIOS Y FORMULARIO BÁSICO */}
          <div className="slots-panel">
            {!selectedDay ? (
              <div className="empty-state">
                <i className="ph ph-calendar-blank"></i>
                <p>Haz clic en un día del calendario para ver las horas disponibles.</p>
              </div>
            ) : (
              <div className="slots-content">
                <h4>Horarios para el {selectedDay} de Julio</h4>
                
                <div className="slots-grid">
                  {availableSlots.map(slot => (
                    <button 
                      key={slot} 
                      className={`time-slot ${selectedSlot === slot ? 'active-slot' : ''}`}   
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>

                {/* Formulario rápido que aparece solo cuando seleccionas una hora */}
                {selectedSlot && (
                  <form className="quick-form" onSubmit={(e) => { e.preventDefault(); alert('Cita Agendada!'); }}>
                    <h5>Completa tu reserva para las {selectedSlot}</h5>
                    <input type="text" placeholder="Nombre completo" required />
                    <input type="tel" placeholder="Teléfono" required />
                    <button type="submit" className="btn-primary full-width">Confirmar Cita</button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <p>© 2026 NeuroClinic. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}