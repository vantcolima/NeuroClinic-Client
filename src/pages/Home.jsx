import { useState } from "react";
import {
  Brain,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Puzzle,
  Users,
  Clock,
  Check,
  LogIn,
} from "lucide-react";
import { COLORES, HORARIOS, DURACION_CITA_MINUTOS } from "../constantes";
import { fechaLarga, horaDeCita, construirFechaHora, sumarMinutos } from "../utils";
import { obtenerCitasPorFecha, crearCita } from "../servicios/api";
import Calendario from "../components/Calendario";
import { Campo, BotonCoral } from "../components/Comunes";

const SERVICIOS_PUBLICOS = [
  {
    titulo: "Evaluación Cognitiva",
    descripcion: "Diagnóstico preciso de atención, memoria y funciones ejecutivas.",
    icono: ClipboardList,
  },
  {
    titulo: "Terapia de Conducta",
    descripcion: "Intervención personalizada para el desarrollo y bienestar emocional.",
    icono: Puzzle,
  },
  {
    titulo: "Neurorehabilitación",
    descripcion: "Acompañamiento clínico para recuperar el bienestar integral.",
    icono: HeartPulse,
  },
];

const FORMULARIO_INICIAL = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  address: "",
  emergencyContact: "",
  emergencyContactPhone: "",
  reason: "",
  observations: "",
};

export default function Home({ onIrALogin }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [errorHorarios, setErrorHorarios] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  const [citaAgendada, setCitaAgendada] = useState(false);

  const actualizarCampo = (campo) => (evento) =>
    setFormulario((anterior) => ({ ...anterior, [campo]: evento.target.value }));

  const seleccionarDia = async (fechaIso) => {
    setFechaSeleccionada(fechaIso);
    setHoraSeleccionada(null);
    setErrorHorarios("");
    setCitaAgendada(false);
    setCargandoHorarios(true);
    try {
      const citasDelDia = await obtenerCitasPorFecha(fechaIso);
      const horasOcupadas = new Set(
        (Array.isArray(citasDelDia) ? citasDelDia : []).map((cita) => horaDeCita(cita))
      );
      setHorariosDisponibles(HORARIOS.filter((horario) => !horasOcupadas.has(horario)));
    } catch {
      setHorariosDisponibles([]);
      setErrorHorarios("No se pudieron cargar los horarios. Intenta de nuevo.");
    } finally {
      setCargandoHorarios(false);
    }
  };

  const datosValidos =
    formulario.firstName.trim() &&
    formulario.lastName.trim() &&
    formulario.phoneNumber.trim() &&
    formulario.reason.trim();

  const enviarCita = async (evento) => {
    evento.preventDefault();
    if (!datosValidos || enviando) return;
    setEnviando(true);
    setErrorEnvio("");
    const inicioCita = new Date(construirFechaHora(fechaSeleccionada, horaSeleccionada));
    const finCita = new Date(
      construirFechaHora(fechaSeleccionada, horaSeleccionada)
    );
    finCita.setMinutes(finCita.getMinutes() + DURACION_CITA_MINUTOS);
    try {
      await crearCita({
        reason: formulario.reason.trim(),
        start_date: inicioCita.toISOString(),
        end_date: finCita.toISOString(),
        observations: formulario.observations.trim(),
        patient: {
          firstName: formulario.firstName.trim(),
          lastName: formulario.lastName.trim(),
          dateOfBirth: formulario.dateOfBirth
            ? new Date(formulario.dateOfBirth).toISOString()
            : null,
          phoneNumber: formulario.phoneNumber.trim(),
          email: formulario.email.trim(),
          address: formulario.address.trim(),
          emergencyContact: formulario.emergencyContact.trim(),
          emergencyContactPhone: formulario.emergencyContactPhone.trim(),
        },
      });
      setCitaAgendada(true);
      setFormulario(FORMULARIO_INICIAL);
      setHorariosDisponibles((anteriores) =>
        anteriores.filter((horario) => horario !== horaSeleccionada)
      );
      setHoraSeleccionada(null);
    } catch {
      setErrorEnvio("No se pudo agendar la cita. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const irASeccion = (idSeccion) => (evento) => {
    evento.preventDefault();
    document.getElementById(idSeccion)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-white"
        style={{ borderBottom: `1px solid ${COLORES.borde}` }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: COLORES.lavanda }}>
            <Brain size={18} style={{ color: COLORES.navy }} />
          </div>
          <p className="font-display font-bold text-xl" style={{ color: COLORES.navy }}>NeuroClinic</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="#inicio" onClick={irASeccion("inicio")} className="text-sm font-semibold hidden sm:block" style={{ color: COLORES.navy }}>
            Inicio
          </a>
          <a href="#servicios" onClick={irASeccion("servicios")} className="text-sm font-semibold hidden sm:block" style={{ color: COLORES.navy }}>
            Servicios
          </a>
          <button
            onClick={irASeccion("agendar")}
            className="px-4 py-2 rounded-full text-sm font-bold"
            style={{ background: COLORES.lavanda, color: COLORES.navy }}
          >
            Agendar Cita
          </button>
          <button
            onClick={onIrALogin}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
            style={{ background: COLORES.navy }}
          >
            <LogIn size={14} /> Iniciar Sesión
          </button>
        </div>
      </nav>

      <section
        id="inicio"
        className="flex flex-col lg:flex-row items-center justify-between gap-10 px-8 lg:px-16 py-16"
        style={{ background: COLORES.fondo }}
      >
        <div className="max-w-xl">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-5"
            style={{ background: COLORES.verde }}
          >
            Ciencia que comprende
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: COLORES.navy }}>
            Rehabilitación Neuropsicológica{" "}
            <span style={{ color: COLORES.azul }}>para tu bienestar</span>
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: COLORES.navySuave }}>
            En NeuroClinic integramos ciencia, empatía y propósito. Ofrecemos evaluaciones
            precisas y terapias personalizadas para acompañarte en tu desarrollo cognitivo y emocional.
          </p>
          <BotonCoral onClick={irASeccion("agendar")}>
            <span className="flex items-center gap-2">
              <CalendarCheck size={17} /> Consultar Disponibilidad
            </span>
          </BotonCoral>
        </div>
        <div
          className="w-full max-w-md aspect-square rounded-3xl flex flex-col items-center justify-center gap-4"
          style={{ background: COLORES.lavanda }}
        >
          <Users size={64} style={{ color: COLORES.azul }} />
          <p className="text-sm font-semibold" style={{ color: COLORES.navySuave }}>
            Atención integral y empática
          </p>
        </div>
      </section>

      <section id="servicios" className="px-8 lg:px-16 py-14 grid gap-6 md:grid-cols-3">
        {SERVICIOS_PUBLICOS.map((servicio) => {
          const Icono = servicio.icono;
          return (
            <div
              key={servicio.titulo}
              className="rounded-3xl p-7 bg-white shadow-sm"
              style={{ border: `1px solid ${COLORES.borde}` }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: COLORES.verdeSuave }}
              >
                <Icono size={22} style={{ color: COLORES.verdeOscuro }} />
              </div>
              <h3 className="font-display text-lg font-bold mb-2" style={{ color: COLORES.navy }}>
                {servicio.titulo}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: COLORES.navySuave }}>
                {servicio.descripcion}
              </p>
            </div>
          );
        })}
      </section>

      <section id="agendar" className="px-8 lg:px-16 py-14" style={{ background: COLORES.fondo }}>
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold mb-2" style={{ color: COLORES.navy }}>
            Agenda tu Evaluación
          </h2>
          <p className="text-sm" style={{ color: COLORES.azul }}>
            Selecciona un día en el calendario para ver los horarios libres.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-7 shadow-sm h-fit">
            <Calendario fechaSeleccionada={fechaSeleccionada} onSeleccionar={seleccionarDia} />
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm">
            {!fechaSeleccionada ? (
              <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
                <CalendarDays size={40} style={{ color: COLORES.azulSuave }} />
                <p className="text-sm max-w-xs" style={{ color: COLORES.textoTenue }}>
                  Haz clic en un día del calendario para ver las horas disponibles.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="font-display text-lg font-bold mb-4" style={{ color: COLORES.navy }}>
                  Horarios para el {fechaLarga(fechaSeleccionada).toLowerCase()}
                </h3>

                {cargandoHorarios ? (
                  <p className="text-sm py-6" style={{ color: COLORES.textoTenue }}>
                    Cargando horarios...
                  </p>
                ) : errorHorarios ? (
                  <div className="py-4">
                    <p className="text-sm mb-3" style={{ color: COLORES.rojo }}>{errorHorarios}</p>
                    <button
                      onClick={() => seleccionarDia(fechaSeleccionada)}
                      className="text-sm font-bold"
                      style={{ color: COLORES.azul }}
                    >
                      Reintentar
                    </button>
                  </div>
                ) : horariosDisponibles.length === 0 ? (
                  <p className="text-sm py-6" style={{ color: COLORES.textoTenue }}>
                    Ya no hay horarios disponibles este día. Prueba con otra fecha.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2.5 mb-6">
                    {horariosDisponibles.map((horario) => {
                      const estaSeleccionado = horaSeleccionada === horario;
                      return (
                        <button
                          key={horario}
                          onClick={() => { setHoraSeleccionada(horario); setCitaAgendada(false); }}
                          className="py-2.5 rounded-xl text-xs font-bold transition-colors"
                          style={
                            estaSeleccionado
                              ? { background: COLORES.verdeSuave, color: COLORES.verdeOscuro, border: `2px solid ${COLORES.verde}` }
                              : { background: "#fff", color: COLORES.navySuave, border: `1px solid ${COLORES.borde}` }
                          }
                        >
                          {horario}
                        </button>
                      );
                    })}
                  </div>
                )}

                {citaAgendada && (
                  <div
                    className="rounded-2xl p-4 flex items-center gap-3 text-sm font-semibold"
                    style={{ background: COLORES.verdeSuave, color: COLORES.verdeOscuro }}
                  >
                    <Check size={18} strokeWidth={3} /> ¡Cita agendada! Te contactaremos para confirmar.
                  </div>
                )}

                {horaSeleccionada && !citaAgendada && (
                  <form onSubmit={enviarCita} className="space-y-4">
                    <p
                      className="text-sm font-bold flex items-center gap-2 pt-2"
                      style={{ color: COLORES.navy, borderTop: `1px solid ${COLORES.borde}`, paddingTop: 16 }}
                    >
                      <Clock size={15} style={{ color: COLORES.verde }} />
                      Completa tu reserva para las {horaSeleccionada}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <Campo
                        label="Nombre(s)"
                        requerido
                        value={formulario.firstName}
                        onChange={actualizarCampo("firstName")}
                        placeholder="Ej: Mateo"
                      />
                      <Campo
                        label="Apellidos"
                        requerido
                        value={formulario.lastName}
                        onChange={actualizarCampo("lastName")}
                        placeholder="Ej: Rodríguez"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Campo
                        label="Fecha de nacimiento"
                        type="date"
                        value={formulario.dateOfBirth}
                        onChange={actualizarCampo("dateOfBirth")}
                      />
                      <Campo
                        label="Teléfono"
                        requerido
                        type="tel"
                        value={formulario.phoneNumber}
                        onChange={actualizarCampo("phoneNumber")}
                        placeholder="312 000 0000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Campo
                        label="Correo"
                        type="email"
                        value={formulario.email}
                        onChange={actualizarCampo("email")}
                        placeholder="correo@ejemplo.com"
                      />
                      <Campo
                        label="Dirección"
                        value={formulario.address}
                        onChange={actualizarCampo("address")}
                        placeholder="Calle, número, colonia"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Campo
                        label="Contacto de emergencia"
                        value={formulario.emergencyContact}
                        onChange={actualizarCampo("emergencyContact")}
                        placeholder="Nombre del contacto"
                      />
                      <Campo
                        label="Teléfono de emergencia"
                        type="tel"
                        value={formulario.emergencyContactPhone}
                        onChange={actualizarCampo("emergencyContactPhone")}
                        placeholder="312 000 0000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: COLORES.navy }}>
                        Motivo de la consulta <span style={{ color: COLORES.coral }}>*</span>
                      </label>
                      <textarea
                        value={formulario.reason}
                        onChange={actualizarCampo("reason")}
                        placeholder="Ej: Dificultades de atención, evaluación neuropsicológica general..."
                        rows={3}
                        className="w-full rounded-2xl p-4 text-sm outline-none resize-none"
                        style={{ border: `1px solid ${COLORES.borde}`, color: COLORES.navy, background: "#FBFBFE" }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1.5" style={{ color: COLORES.navy }}>
                        Observaciones (opcional)
                      </label>
                      <textarea
                        value={formulario.observations}
                        onChange={actualizarCampo("observations")}
                        placeholder="¿Hay alguna condición médica previa o medicación que debamos conocer?"
                        rows={2}
                        className="w-full rounded-2xl p-4 text-sm outline-none resize-none"
                        style={{ border: `1px solid ${COLORES.borde}`, color: COLORES.navy, background: "#FBFBFE" }}
                      />
                    </div>

                    {errorEnvio && (
                      <p className="text-sm font-semibold" style={{ color: COLORES.rojo }}>{errorEnvio}</p>
                    )}

                    <button
                      type="submit"
                      disabled={!datosValidos || enviando}
                      className={`w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md transition-opacity ${
                        datosValidos && !enviando ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
                      }`}
                      style={{ background: COLORES.coral }}
                    >
                      {enviando ? "Agendando..." : "Confirmar Cita"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer
        className="px-8 py-6 text-center text-sm"
        style={{ background: "#fff", color: COLORES.textoTenue, borderTop: `1px solid ${COLORES.borde}` }}
      >
        © 2026 NeuroClinic. Todos los derechos reservados.
      </footer>
    </div>
  );
}