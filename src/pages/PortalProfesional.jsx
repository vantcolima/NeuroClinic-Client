import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  UserPlus,
  Plus,
  Check,
  X,
  Phone,
  Mail,
  Settings,
  Clock,
} from "lucide-react";
import {
  COLORES,
  SERVICIOS,
  HORARIOS,
  DIAS_SEMANA,
  ESTADO_AGENDADA,
  ESTADO_CANCELADA,
  ESTADO_COMPLETADA,
} from "../constantes";
import {
  hoy,
  fechaAIso,
  fechaLarga,
  iniciales,
  nombreCompletoPaciente,
  construirFechaHora,
  sumarMinutos,
  fechaDeCita,
  horaDeCita,
} from "../utils";
import Sidebar from "../components/Sidebar";
import Calendario from "../components/Calendario";
import FormNuevoPaciente from "../components/FormNuevoPaciente";
import { AvatarIniciales, EstadoChip, BotonCoral, BotonAtras } from "../components/Comunes";

function AjustesDisponibilidad({ profesional, onGuardar }) {
  const [diasLaborables, setDiasLaborables] = useState(profesional.dias || []);
  const [horariosAtencion, setHorariosAtencion] = useState(profesional.horarios || []);
  const [cambiosGuardados, setCambiosGuardados] = useState(false);

  const alternar = (lista, actualizarLista, valor) => {
    setCambiosGuardados(false);
    actualizarLista(
      lista.includes(valor) ? lista.filter((elemento) => elemento !== valor) : [...lista, valor]
    );
  };

  const configuracionValida = diasLaborables.length > 0 && horariosAtencion.length > 0;

  return (
    <div className="bg-white rounded-3xl p-7 shadow-sm max-w-2xl">
      <p className="font-display text-lg font-bold mb-1 flex items-center gap-2" style={{ color: COLORES.navy }}>
        <Clock size={19} style={{ color: COLORES.verde }} /> Disponibilidad
      </p>
      <p className="text-sm mb-6" style={{ color: COLORES.azul }}>
        Configura tus días de trabajo y horarios de atención. Solo estas opciones
        aparecerán al reservar una cita contigo.
      </p>

      <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>Días de trabajo</p>
      <div className="flex gap-2 flex-wrap mb-7">
        {DIAS_SEMANA.map((nombreDia, indiceDia) => {
          const estaActivo = diasLaborables.includes(indiceDia);
          return (
            <button
              key={nombreDia}
              onClick={() => alternar(diasLaborables, setDiasLaborables, indiceDia)}
              className="px-4 py-2.5 rounded-2xl text-sm font-bold transition-colors"
              style={
                estaActivo
                  ? { background: COLORES.navy, color: "#fff" }
                  : { background: "#fff", color: COLORES.navySuave, border: `1px solid ${COLORES.borde}` }
              }
            >
              {nombreDia}
            </button>
          );
        })}
      </div>

      <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>Horarios de atención</p>
      <div className="grid grid-cols-3 gap-2.5 mb-7">
        {HORARIOS.map((horario) => {
          const estaActivo = horariosAtencion.includes(horario);
          return (
            <button
              key={horario}
              onClick={() => alternar(horariosAtencion, setHorariosAtencion, horario)}
              className="py-2.5 rounded-xl text-xs font-bold transition-colors"
              style={
                estaActivo
                  ? { background: COLORES.verdeSuave, color: COLORES.verdeOscuro, border: `2px solid ${COLORES.verde}` }
                  : { background: "#fff", color: COLORES.textoTenue, border: `1px solid ${COLORES.borde}` }
              }
            >
              {horario}
            </button>
          );
        })}
      </div>

      {!configuracionValida && (
        <p className="text-xs mb-4" style={{ color: COLORES.rojo }}>
          Debes dejar activo al menos un día y un horario.
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {cambiosGuardados && (
          <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: COLORES.verdeOscuro }}>
            <Check size={14} strokeWidth={3} /> Cambios guardados
          </span>
        )}
        <button
          onClick={() => {
            onGuardar({ dias: diasLaborables, horarios: horariosAtencion });
            setCambiosGuardados(true);
          }}
          disabled={!configuracionValida}
          className={`px-7 py-3 rounded-full text-sm font-bold text-white shadow-md transition-opacity ${
            configuracionValida ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
          }`}
          style={{ background: COLORES.verde }}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}

export default function PortalProfesional({
  usuario,
  pacientes,
  agregarPaciente,
  actualizarProfesional,
  citas,
  agregarCita,
  actualizarEstado,
  onCerrarSesion,
}) {
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [creandoCita, setCreandoCita] = useState(false);
  const [registrandoPaciente, setRegistrandoPaciente] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(fechaAIso(hoy));

  const [nuevaCitaPacienteId, setNuevaCitaPacienteId] = useState(null);
  const [nuevaCitaServicioId, setNuevaCitaServicioId] = useState("terapia");
  const [nuevaCitaFecha, setNuevaCitaFecha] = useState(null);
  const [nuevaCitaHora, setNuevaCitaHora] = useState(null);
  const [nuevaCitaMotivo, setNuevaCitaMotivo] = useState("");

  const buscarPaciente = (pacienteId) => pacientes.find((paciente) => paciente.id === pacienteId);
  const etiquetaServicio = (cita) =>
    SERVICIOS.find((servicio) => servicio.id === cita.servicioId)?.etiqueta || "Sesión";

  const citasDelDoctor = citas
    .filter((cita) => cita.doctorId === usuario.id)
    .sort((citaA, citaB) => citaA.start_date.localeCompare(citaB.start_date));
  const citasDeHoy = citasDelDoctor.filter(
    (cita) => fechaDeCita(cita) === fechaAIso(hoy) && cita.appointmentStateId === ESTADO_AGENDADA
  );
  const citasDelDia = citasDelDoctor.filter(
    (cita) => fechaDeCita(cita) === diaSeleccionado && cita.appointmentStateId !== ESTADO_CANCELADA
  );

  const diasConCitas = useMemo(() => {
    const conteo = {};
    citasDelDoctor.forEach((cita) => {
      if (cita.appointmentStateId !== ESTADO_CANCELADA) {
        const fecha = fechaDeCita(cita);
        conteo[fecha] = (conteo[fecha] || 0) + 1;
      }
    });
    return conteo;
  }, [citasDelDoctor]);

  const horasOcupadas = useMemo(
    () =>
      new Set(
        citas
          .filter(
            (cita) =>
              cita.doctorId === usuario.id &&
              nuevaCitaFecha &&
              fechaDeCita(cita) === nuevaCitaFecha &&
              cita.appointmentStateId === ESTADO_AGENDADA
          )
          .map((cita) => horaDeCita(cita))
      ),
    [citas, usuario.id, nuevaCitaFecha]
  );

  const horariosDelDoctor = usuario.horarios?.length
    ? HORARIOS.filter((horario) => usuario.horarios.includes(horario))
    : HORARIOS;

  const reiniciarFormularioCita = () => {
    setCreandoCita(false);
    setNuevaCitaPacienteId(null);
    setNuevaCitaServicioId("terapia");
    setNuevaCitaFecha(null);
    setNuevaCitaHora(null);
    setNuevaCitaMotivo("");
  };

  const guardarNuevaCita = () => {
    const servicioElegido = SERVICIOS.find((servicio) => servicio.id === nuevaCitaServicioId);
    const startDate = construirFechaHora(nuevaCitaFecha, nuevaCitaHora);
    agregarCita({
      doctorId: usuario.id,
      patientId: nuevaCitaPacienteId,
      reason: nuevaCitaMotivo.trim(),
      start_date: startDate,
      end_date: sumarMinutos(startDate, servicioElegido.duracionMinutos),
      appointmentStateId: ESTADO_AGENDADA,
      observations: "",
      servicioId: nuevaCitaServicioId,
    });
    const fechaGuardada = nuevaCitaFecha;
    reiniciarFormularioCita();
    setSeccionActiva("sesiones");
    setDiaSeleccionado(fechaGuardada);
  };

  const FilaCita = ({ cita }) => {
    const paciente = buscarPaciente(cita.patientId);
    const nombrePaciente = paciente ? nombreCompletoPaciente(paciente) : "Paciente";
    return (
      <div className="flex items-center gap-4 py-4" style={{ borderBottom: `1px solid ${COLORES.borde}` }}>
        <div
          className="rounded-xl px-3 py-2 text-center shrink-0 min-w-20"
          style={{ background: COLORES.lavanda }}
        >
          <p className="text-sm font-bold" style={{ color: COLORES.navy }}>{horaDeCita(cita)}</p>
        </div>
        <AvatarIniciales
          texto={paciente ? iniciales(nombrePaciente) : "?"}
          fondo={COLORES.verdeSuave}
          color={COLORES.verdeOscuro}
          tamano={38}
          tamanoFuente={12}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: COLORES.navy }}>
            {nombrePaciente}
          </p>
          <p className="text-xs" style={{ color: COLORES.azul }}>{etiquetaServicio(cita)}</p>
          {cita.reason && (
            <p className="text-xs mt-0.5 truncate" style={{ color: COLORES.textoTenue }}>
              Motivo: {cita.reason}
            </p>
          )}
        </div>
        <EstadoChip estadoId={cita.appointmentStateId} />
        {cita.appointmentStateId === ESTADO_AGENDADA && (
          <div className="flex gap-2">
            <button
              onClick={() => actualizarEstado(cita.id, ESTADO_COMPLETADA)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: COLORES.verdeSuave, color: COLORES.verdeOscuro }}
              title="Marcar completada"
            >
              <Check size={15} strokeWidth={3} />
            </button>
            <button
              onClick={() => actualizarEstado(cita.id, ESTADO_CANCELADA)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
              style={{ background: COLORES.rojoSuave, color: COLORES.rojo }}
              title="Cancelar"
            >
              <X size={15} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-1">
      <Sidebar
        subtitulo="Cuidado Empático"
        items={[
          { id: "dashboard", label: "Dashboard", icono: LayoutDashboard },
          { id: "pacientes", label: "Pacientes", icono: Users },
          { id: "sesiones", label: "Sesiones", icono: CalendarDays },
          { id: "ajustes", label: "Ajustes", icono: Settings },
        ]}
        seccionActiva={creandoCita ? "" : seccionActiva}
        onCambiarSeccion={(seccionId) => {
          setSeccionActiva(seccionId);
          setCreandoCita(false);
          setRegistrandoPaciente(false);
        }}
        onCerrarSesion={onCerrarSesion}
        botonPrincipal={
          <button
            onClick={() => setCreandoCita(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ background: COLORES.coral }}
          >
            <Plus size={16} strokeWidth={3} /> Nueva Cita
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        {creandoCita ? (
          <div className="max-w-4xl">
            <div className="mb-7">
              <h1 className="font-display text-3xl font-bold" style={{ color: COLORES.navy }}>
                Nueva Cita
              </h1>
              <p className="text-sm mt-1" style={{ color: COLORES.azul }}>
                Programa una sesión para uno de tus pacientes.
              </p>
            </div>

            {pacientes.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center shadow-sm max-w-lg">
                <Users size={34} className="mx-auto mb-3" style={{ color: COLORES.azulSuave }} />
                <p className="font-display font-bold mb-1" style={{ color: COLORES.navy }}>
                  Aún no tienes pacientes registrados
                </p>
                <p className="text-sm mb-5" style={{ color: COLORES.textoTenue }}>
                  Registra a tu primer paciente para poder agendar una cita.
                </p>
                <BotonCoral
                  onClick={() => {
                    reiniciarFormularioCita();
                    setSeccionActiva("pacientes");
                    setRegistrandoPaciente(true);
                  }}
                >
                  <span className="flex items-center gap-2"><UserPlus size={15} /> Registrar Paciente</span>
                </BotonCoral>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-7 shadow-sm space-y-7 h-fit">
                    <div>
                      <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>Paciente</p>
                      <div className="space-y-3">
                        {pacientes.map((paciente) => {
                          const estaSeleccionado = nuevaCitaPacienteId === paciente.id;
                          const nombrePaciente = nombreCompletoPaciente(paciente);
                          return (
                            <button
                              key={paciente.id}
                              onClick={() => setNuevaCitaPacienteId(paciente.id)}
                              className="w-full flex items-center gap-3 rounded-2xl p-3 text-left transition-colors"
                              style={{
                                border: estaSeleccionado
                                  ? `2px solid ${COLORES.verde}`
                                  : `1px solid ${COLORES.borde}`,
                                background: estaSeleccionado ? "#F4FBF8" : "#fff",
                              }}
                            >
                              <AvatarIniciales
                                texto={iniciales(nombrePaciente)}
                                fondo={COLORES.lavanda}
                                tamano={36}
                                tamanoFuente={12}
                              />
                              <span className="text-sm font-bold flex-1" style={{ color: COLORES.navy }}>
                                {nombrePaciente}
                              </span>
                              {estaSeleccionado && <Check size={16} style={{ color: COLORES.verde }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>Servicio</p>
                      <div className="flex gap-3">
                        {SERVICIOS.map((servicio) => {
                          const estaSeleccionado = nuevaCitaServicioId === servicio.id;
                          return (
                            <button
                              key={servicio.id}
                              onClick={() => setNuevaCitaServicioId(servicio.id)}
                              className="flex-1 rounded-2xl p-4 text-left transition-colors"
                              style={{
                                border: estaSeleccionado
                                  ? `2px solid ${COLORES.verde}`
                                  : `1px solid ${COLORES.borde}`,
                                background: estaSeleccionado ? "#F4FBF8" : "#fff",
                              }}
                            >
                              <p className="text-sm font-bold" style={{ color: COLORES.navy }}>
                                {servicio.nombre}
                              </p>
                              <p className="text-xs mt-0.5" style={{ color: COLORES.azul }}>
                                {servicio.duracion}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold mb-2.5" style={{ color: COLORES.navy }}>
                        Motivo de la consulta
                      </p>
                      <textarea
                        value={nuevaCitaMotivo}
                        onChange={(evento) => setNuevaCitaMotivo(evento.target.value)}
                        placeholder="Ej: Seguimiento de evaluación, sesión de terapia..."
                        rows={3}
                        className="w-full rounded-2xl p-4 text-sm outline-none resize-none"
                        style={{ border: `1px solid ${COLORES.borde}`, color: COLORES.navy, background: "#FBFBFE" }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-7 shadow-sm h-fit">
                    <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>Día</p>
                    <Calendario
                      fechaSeleccionada={nuevaCitaFecha}
                      onSeleccionar={(fechaIso) => { setNuevaCitaFecha(fechaIso); setNuevaCitaHora(null); }}
                      diasConCitas={diasConCitas}
                      diasLaborables={usuario.dias ?? null}
                    />

                    <div className="mt-6" style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 20 }}>
                      <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>Horario</p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {horariosDelDoctor.map((horario) => {
                          const estaOcupado = horasOcupadas.has(horario);
                          const estaSeleccionado = nuevaCitaHora === horario;
                          return (
                            <button
                              key={horario}
                              disabled={estaOcupado || !nuevaCitaFecha}
                              onClick={() => setNuevaCitaHora(horario)}
                              className="py-2.5 rounded-xl text-xs font-bold transition-colors"
                              style={
                                estaSeleccionado
                                  ? {
                                      background: COLORES.verdeSuave,
                                      color: COLORES.verde,
                                      border: `2px solid ${COLORES.verde}`,
                                    }
                                  : estaOcupado
                                  ? {
                                      background: "#F3F4FA",
                                      color: "#C4C8DE",
                                      textDecoration: "line-through",
                                      border: "2px solid transparent",
                                    }
                                  : {
                                      background: "#fff",
                                      color: COLORES.navySuave,
                                      border: `1px solid ${COLORES.borde}`,
                                    }
                              }
                            >
                              {horario}
                            </button>
                          );
                        })}
                      </div>
                      {!nuevaCitaFecha && (
                        <p className="text-xs mt-2.5" style={{ color: COLORES.textoTenue }}>
                          Selecciona primero un día para ver la disponibilidad.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-7">
                  <BotonAtras onClick={reiniciarFormularioCita} />
                  <BotonCoral
                    disabled={!nuevaCitaPacienteId || !nuevaCitaFecha || !nuevaCitaHora}
                    onClick={guardarNuevaCita}
                  >
                    Guardar Cita ✓
                  </BotonCoral>
                </div>
              </>
            )}
          </div>
        ) : seccionActiva === "dashboard" ? (
          <>
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold" style={{ color: COLORES.navy }}>
                Hola, {usuario.nombre}
              </h1>
              <p className="text-sm mt-1" style={{ color: COLORES.azul }}>
                Aquí está tu resumen clínico de hoy.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-sm max-w-3xl">
              <div className="flex items-center justify-between mb-2">
                <p
                  className="font-display text-xl font-bold flex items-center gap-2.5"
                  style={{ color: COLORES.navy }}
                >
                  <CalendarDays size={20} style={{ color: COLORES.coral }} /> Mi Agenda · Hoy
                </p>
                <button
                  onClick={() => setSeccionActiva("sesiones")}
                  className="text-xs font-bold"
                  style={{ color: COLORES.azul }}
                >
                  Ver todo →
                </button>
              </div>
              {citasDeHoy.length === 0 ? (
                <p className="text-sm py-6" style={{ color: COLORES.textoTenue }}>
                  No tienes sesiones programadas para hoy.
                </p>
              ) : (
                citasDeHoy.map((cita) => <FilaCita key={cita.id} cita={cita} />)
              )}
              <div
                className="mt-5 rounded-2xl p-4 text-sm font-semibold"
                style={{ background: COLORES.verdeSuave, color: COLORES.verdeOscuro }}
              >
                Tienes {citasDeHoy.length} {citasDeHoy.length === 1 ? "sesión" : "sesiones"} hoy y{" "}
                {pacientes.length} {pacientes.length === 1 ? "paciente registrado" : "pacientes registrados"}.
              </div>
            </div>
          </>
        ) : seccionActiva === "pacientes" ? (
          <>
            <div className="flex items-start justify-between mb-7">
              <div>
                <h1 className="font-display text-3xl font-bold" style={{ color: COLORES.navy }}>
                  Gestión de Pacientes
                </h1>
                <p className="text-sm mt-1" style={{ color: COLORES.azul }}>
                  Directorio clínico de tus pacientes.
                </p>
              </div>
              {!registrandoPaciente && (
                <button
                  onClick={() => setRegistrandoPaciente(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                  style={{ background: COLORES.navy }}
                >
                  <UserPlus size={15} /> Nuevo Paciente
                </button>
              )}
            </div>

            {registrandoPaciente ? (
              <FormNuevoPaciente
                onGuardar={(datosPaciente) => {
                  agregarPaciente(datosPaciente);
                  setRegistrandoPaciente(false);
                }}
                onCancelar={() => setRegistrandoPaciente(false)}
              />
            ) : pacientes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm max-w-xl">
                <Users size={36} className="mx-auto mb-3" style={{ color: COLORES.azulSuave }} />
                <p className="font-display font-bold mb-1" style={{ color: COLORES.navy }}>
                  Todavía no hay pacientes
                </p>
                <p className="text-sm mb-6" style={{ color: COLORES.textoTenue }}>
                  Registra a tu primer paciente para comenzar a agendar sesiones.
                </p>
                <BotonCoral onClick={() => setRegistrandoPaciente(true)}>
                  <span className="flex items-center gap-2"><UserPlus size={15} /> Registrar Paciente</span>
                </BotonCoral>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-w-3xl">
                {pacientes.map((paciente) => {
                  const numeroCitasProximas = citas.filter(
                    (cita) =>
                      cita.patientId === paciente.id &&
                      cita.appointmentStateId === ESTADO_AGENDADA &&
                      fechaDeCita(cita) >= fechaAIso(hoy)
                  ).length;
                  const nombrePaciente = nombreCompletoPaciente(paciente);
                  return (
                    <div
                      key={paciente.id}
                      className="bg-white rounded-3xl p-5 shadow-sm flex items-start gap-3.5"
                    >
                      <AvatarIniciales
                        texto={iniciales(nombrePaciente)}
                        fondo={COLORES.verdeSuave}
                        color={COLORES.verdeOscuro}
                        tamano={46}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold truncate" style={{ color: COLORES.navy }}>
                          {nombrePaciente}
                        </p>
                        {paciente.phoneNumber && (
                          <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: COLORES.azul }}>
                            <Phone size={11} /> {paciente.phoneNumber}
                          </p>
                        )}
                        {paciente.email && (
                          <p
                            className="text-xs mt-1 flex items-center gap-1.5 truncate"
                            style={{ color: COLORES.azul }}
                          >
                            <Mail size={11} /> {paciente.email}
                          </p>
                        )}
                        {paciente.generalNotes && (
                          <p className="text-xs mt-1 truncate" style={{ color: COLORES.textoTenue }}>
                            {paciente.generalNotes}
                          </p>
                        )}
                        <p
                          className="text-xs mt-2 font-semibold"
                          style={{ color: numeroCitasProximas ? COLORES.verdeOscuro : COLORES.textoTenue }}
                        >
                          {numeroCitasProximas
                            ? `${numeroCitasProximas} ${numeroCitasProximas === 1 ? "cita próxima" : "citas próximas"}`
                            : "Sin citas próximas"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : seccionActiva === "ajustes" ? (
          <>
            <div className="mb-7">
              <h1 className="font-display text-3xl font-bold" style={{ color: COLORES.navy }}>
                Ajustes del Profesional
              </h1>
              <p className="text-sm mt-1" style={{ color: COLORES.azul }}>
                Gestiona tu disponibilidad para las reservas.
              </p>
            </div>
            <AjustesDisponibilidad
              key={usuario.id}
              profesional={usuario}
              onGuardar={(datosDisponibilidad) => actualizarProfesional(usuario.id, datosDisponibilidad)}
            />
          </>
        ) : (
          <>
            <div className="flex items-start justify-between mb-7">
              <div>
                <h1 className="font-display text-3xl font-bold" style={{ color: COLORES.navy }}>
                  Agenda de Sesiones
                </h1>
                <p className="text-sm mt-1" style={{ color: COLORES.azul }}>
                  Selecciona un día en el calendario para ver sus sesiones.
                </p>
              </div>
              <BotonCoral onClick={() => setCreandoCita(true)}>+ Nueva Cita</BotonCoral>
            </div>

            <div className="grid grid-cols-5 gap-6 max-w-5xl">
              <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm h-fit">
                <Calendario
                  fechaSeleccionada={diaSeleccionado}
                  onSeleccionar={setDiaSeleccionado}
                  diasConCitas={diasConCitas}
                  permitirPasado
                />
                <p className="text-xs mt-4 flex items-center gap-2" style={{ color: COLORES.textoTenue }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: COLORES.coral }}
                  />
                  Días con sesiones
                </p>
              </div>

              <div className="col-span-3 bg-white rounded-3xl p-7 shadow-sm h-fit">
                <p className="font-display text-lg font-bold mb-2" style={{ color: COLORES.navy }}>
                  {fechaLarga(diaSeleccionado)}
                </p>
                {citasDelDia.length === 0 ? (
                  <p className="text-sm py-6" style={{ color: COLORES.textoTenue }}>
                    Sin sesiones programadas este día.
                  </p>
                ) : (
                  citasDelDia.map((cita) => <FilaCita key={cita.id} cita={cita} />)
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}