import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Plus,
  User,
  Clock,
} from "lucide-react";
import { COLORES, SERVICIOS, MESES, ESTADO_AGENDADA, ESTADO_CANCELADA } from "../constantes";
import { hoy, fechaAIso, isoAFecha, fechaLarga, fechaDeCita, horaDeCita } from "../utils";
import Sidebar from "../components/Sidebar";
import Calendario from "../components/Calendario";
import { EstadoChip } from "../components/Comunes";
import ReservarCita from "./ReservarCita";

export default function PortalPaciente({
  usuario,
  profesionales,
  citas,
  agregarCita,
  cancelarCita,
  actualizarPaciente,
  onCerrarSesion,
}) {
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [reservando, setReservando] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(fechaAIso(hoy));

  const misCitas = citas
    .filter((cita) => cita.patientId === usuario.id && cita.appointmentStateId !== ESTADO_CANCELADA)
    .sort((citaA, citaB) => citaA.start_date.localeCompare(citaB.start_date));
  const citasProximas = misCitas.filter((cita) => fechaDeCita(cita) >= fechaAIso(hoy));
  const proximaCita = citasProximas[0];
  const citasDelDia = misCitas.filter((cita) => fechaDeCita(cita) === diaSeleccionado);
  const buscarDoctor = (doctorId) => profesionales.find((profesional) => profesional.id === doctorId);
  const etiquetaServicio = (cita) =>
    SERVICIOS.find((servicio) => servicio.id === cita.servicioId)?.etiqueta || "Sesión";

  const diasConCitas = useMemo(() => {
    const conteo = {};
    misCitas.forEach((cita) => {
      const fecha = fechaDeCita(cita);
      conteo[fecha] = (conteo[fecha] || 0) + 1;
    });
    return conteo;
  }, [misCitas]);

  const BotonReservar = () => (
    <button
      onClick={() => setReservando(true)}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
      style={{ background: COLORES.verde }}
    >
      <Plus size={16} strokeWidth={3} /> Reservar Nueva Cita
    </button>
  );

  const TarjetaCita = ({ cita, conAcciones }) => {
    const doctor = buscarDoctor(cita.doctorId);
    const fechaCita = fechaDeCita(cita);
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="rounded-2xl px-4 py-3 text-center shrink-0" style={{ background: COLORES.lavanda }}>
          <p className="text-xs font-bold uppercase" style={{ color: COLORES.azul }}>
            {MESES[isoAFecha(fechaCita).getMonth()].slice(0, 3)}
          </p>
          <p className="font-display text-2xl font-bold leading-tight" style={{ color: COLORES.navy }}>
            {isoAFecha(fechaCita).getDate()}
          </p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold truncate" style={{ color: COLORES.navy }}>
            {etiquetaServicio(cita)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: COLORES.azul }}>
            {doctor ? doctor.nombre : "Profesional"} · {horaDeCita(cita)}
          </p>
          {cita.reason && (
            <p className="text-xs mt-1 truncate" style={{ color: COLORES.textoTenue }}>
              {cita.reason}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <EstadoChip estadoId={cita.appointmentStateId} />
          {conAcciones && cita.appointmentStateId === ESTADO_AGENDADA && (
            <button
              onClick={() => cancelarCita(cita.id)}
              className="text-xs font-bold"
              style={{ color: COLORES.rojo }}
            >
              Cancelar cita
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-1">
      <Sidebar
        subtitulo="Portal del Paciente"
        items={[
          { id: "dashboard", label: "Dashboard", icono: LayoutDashboard },
          { id: "citas", label: "Mis Citas", icono: CalendarDays },
        ]}
        seccionActiva={reservando ? "" : seccionActiva}
        onCambiarSeccion={(seccionId) => { setSeccionActiva(seccionId); setReservando(false); }}
        onCerrarSesion={onCerrarSesion}
      />

      {reservando ? (
        <ReservarCita
          usuario={usuario}
          profesionales={profesionales}
          citas={citas}
          actualizarPaciente={actualizarPaciente}
          onConfirmar={agregarCita}
          onSalir={() => { setReservando(false); setSeccionActiva("citas"); }}
        />
      ) : (
        <main className="flex-1 overflow-y-auto px-10 py-8">
          {seccionActiva === "dashboard" && (
            <>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="font-display text-3xl font-bold" style={{ color: COLORES.navy }}>
                    ¡Hola, {usuario.firstName}! 👋
                  </h1>
                  <p className="text-sm mt-1" style={{ color: COLORES.azul }}>
                    Aquí tienes tu espacio para agendar y revisar tus sesiones.
                  </p>
                </div>
                <BotonReservar />
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 max-w-xl">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="font-display text-lg font-bold flex items-center gap-2"
                    style={{ color: COLORES.navy }}
                  >
                    <CalendarCheck size={18} style={{ color: COLORES.verde }} /> Próxima Sesión
                  </p>
                  {proximaCita && <EstadoChip estadoId={proximaCita.appointmentStateId} />}
                </div>
                {proximaCita ? (
                  <div className="flex gap-4">
                    <div className="rounded-2xl px-4 py-3 text-center" style={{ background: COLORES.lavanda }}>
                      <p className="text-xs font-bold uppercase" style={{ color: COLORES.azul }}>
                        {MESES[isoAFecha(fechaDeCita(proximaCita)).getMonth()].slice(0, 3)}
                      </p>
                      <p className="font-display text-2xl font-bold" style={{ color: COLORES.navy }}>
                        {isoAFecha(fechaDeCita(proximaCita)).getDate()}
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-xl font-bold" style={{ color: COLORES.navy }}>
                        {horaDeCita(proximaCita)}
                      </p>
                      <p className="text-sm font-semibold" style={{ color: COLORES.navySuave }}>
                        {etiquetaServicio(proximaCita)}
                      </p>
                      <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: COLORES.azul }}>
                        <User size={12} /> {buscarDoctor(proximaCita.doctorId)?.nombre}
                      </p>
                      <p className="text-xs mt-1 flex items-center gap-1.5" style={{ color: COLORES.azul }}>
                        <Clock size={12} /> Termina {horaDeCita({ start_date: proximaCita.end_date })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm py-2" style={{ color: COLORES.textoTenue }}>
                    Aún no tienes sesiones agendadas. Reserva tu primera cita.
                  </p>
                )}
                <button
                  onClick={() => setSeccionActiva("citas")}
                  className="mt-5 px-5 py-2.5 rounded-full text-xs font-bold bg-white"
                  style={{ color: COLORES.navy, border: `1px solid ${COLORES.borde}` }}
                >
                  Ver Calendario Completo
                </button>
              </div>
            </>
          )}

          {seccionActiva === "citas" && (
            <>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h1 className="font-display text-3xl font-bold" style={{ color: COLORES.navy }}>
                    Mis Citas
                  </h1>
                  <p className="text-sm mt-1" style={{ color: COLORES.azul }}>
                    Consulta tu calendario y gestiona tus sesiones.
                  </p>
                </div>
                <BotonReservar />
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
                    Días con citas
                  </p>
                </div>

                <div className="col-span-3 space-y-4">
                  <p className="font-display text-lg font-bold" style={{ color: COLORES.navy }}>
                    {fechaLarga(diaSeleccionado)}
                  </p>
                  {citasDelDia.length === 0 ? (
                    <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
                      <CalendarDays size={30} className="mx-auto mb-3" style={{ color: COLORES.azulSuave }} />
                      <p className="text-sm" style={{ color: COLORES.textoTenue }}>
                        No tienes citas este día.
                      </p>
                    </div>
                  ) : (
                    citasDelDia.map((cita) => <TarjetaCita key={cita.id} cita={cita} conAcciones />)
                  )}

                  {citasProximas.length > 0 && (
                    <>
                      <p className="font-display text-lg font-bold pt-2" style={{ color: COLORES.navy }}>
                        Próximas citas
                      </p>
                      {citasProximas.map((cita) => (
                        <TarjetaCita key={`proxima-${cita.id}`} cita={cita} conAcciones />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}