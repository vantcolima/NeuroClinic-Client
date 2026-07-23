import { useState, useMemo } from "react";
import {
  Check,
  Clock,    
  MapPin,
  User,
  Users,
  Stethoscope,
  Info,
  CalendarDays,
  CalendarCheck,
  ClipboardList,
} from "lucide-react";
import { COLORES, SERVICIOS, HORARIOS, MESES, ESTADO_AGENDADA } from "../constantes";
import {
  isoAFecha,
  fechaLarga,
  fechaCorta,
  iniciales,
  nombreCompletoPaciente,
  construirFechaHora,
  sumarMinutos,
  fechaDeCita,
  horaDeCita,
} from "../utils";
import { AvatarIniciales, BotonCoral, BotonAtras, Campo } from "../components/Comunes";
import Calendario from "../components/Calendario";
import Stepper from "../components/Stepper";

export default function ReservarCita({
  usuario,
  profesionales,
  citas,
  actualizarPaciente,
  onConfirmar,
  onSalir,
}) {
  const [pasoActual, setPasoActual] = useState(1);
  const [servicioId, setServicioId] = useState(null);
  const [fechaElegida, setFechaElegida] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [horaElegida, setHoraElegida] = useState(null);
  const [firstName, setFirstName] = useState(usuario.firstName || "");
  const [lastName, setLastName] = useState(usuario.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(usuario.phoneNumber || "");
  const [email, setEmail] = useState(usuario.email || "");
  const [reason, setReason] = useState("");
  const [observations, setObservations] = useState("");
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  const servicioElegido = SERVICIOS.find((servicio) => servicio.id === servicioId);
  const doctorElegido = profesionales.find((profesional) => profesional.id === doctorId);

  const horariosDelDoctor = doctorElegido?.horarios?.length
    ? HORARIOS.filter((horario) => doctorElegido.horarios.includes(horario))
    : HORARIOS;

  const elegirDoctor = (doctor) => {
    setDoctorId(doctor.id);
    setHoraElegida(null);
    if (fechaElegida && doctor.dias && !doctor.dias.includes(isoAFecha(fechaElegida).getDay())) {
      setFechaElegida(null);
    }
  };

  const horasOcupadas = useMemo(() => {
    if (!doctorId || !fechaElegida) return new Set();
    return new Set(
      citas
        .filter(
          (cita) =>
            cita.doctorId === doctorId &&
            fechaDeCita(cita) === fechaElegida &&
            cita.appointmentStateId === ESTADO_AGENDADA
        )
        .map((cita) => horaDeCita(cita))
    );
  }, [citas, doctorId, fechaElegida]);

  const datosPacienteValidos = firstName.trim() && lastName.trim();

  const confirmarReserva = () => {
    actualizarPaciente(usuario.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
    });
    const startDate = construirFechaHora(fechaElegida, horaElegida);
    onConfirmar({
      doctorId,
      patientId: usuario.id,
      reason: reason.trim(),
      start_date: startDate,
      end_date: sumarMinutos(startDate, servicioElegido.duracionMinutos),
      appointmentStateId: ESTADO_AGENDADA,
      observations: observations.trim(),
      servicioId,
    });
    setReservaConfirmada(true);
  };

  if (reservaConfirmada) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: COLORES.verdeSuave }}
        >
          <CalendarCheck size={36} style={{ color: COLORES.verde }} />
        </div>
        <h2 className="font-display text-3xl font-bold mb-2" style={{ color: COLORES.navy }}>
          ¡Cita reservada!
        </h2>
        <p className="text-sm mb-1" style={{ color: COLORES.azul }}>
          {doctorElegido.nombre} · {servicioElegido.etiqueta}
        </p>
        <p className="text-sm mb-8" style={{ color: COLORES.azul }}>
          {fechaLarga(fechaElegida)} · {horaElegida}
        </p>
        <BotonCoral onClick={onSalir}>Ir a Mis Citas</BotonCoral>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-10 py-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: COLORES.navy }}>
          Reservar Cita
        </h1>
        <p className="text-sm" style={{ color: COLORES.azul }}>
          Sigue estos sencillos pasos para programar tu próxima sesión.
        </p>
      </div>

      <Stepper pasos={["Servicio", "Fecha y Hora", "Detalles", "Confirmación"]} pasoActual={pasoActual} />

      {pasoActual === 1 && (
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: COLORES.navy }}>
            ¿Qué necesitas hoy?
          </h2>
          <div className="grid grid-cols-2 gap-5 mb-10">
            {SERVICIOS.map((servicio) => {
              const Icono = servicio.icono;
              const estaSeleccionado = servicioId === servicio.id;
              return (
                <button
                  key={servicio.id}
                  onClick={() => setServicioId(servicio.id)}
                  className="bg-white rounded-3xl p-6 text-left transition-shadow shadow-sm hover:shadow-md"
                  style={{ border: estaSeleccionado ? `2px solid ${COLORES.verde}` : `2px solid transparent` }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: servicio.id === "terapia" ? COLORES.verdeSuave : "#F0F6DE" }}
                  >
                    <Icono size={22} style={{ color: servicio.id === "terapia" ? COLORES.verde : "#9CB13E" }} />
                  </div>
                  <p className="font-display text-xl font-bold mb-1.5" style={{ color: COLORES.navy }}>
                    {servicio.nombre}
                  </p>
                  <p className="text-sm mb-4" style={{ color: COLORES.azul }}>{servicio.descripcion}</p>
                  <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "#9CB13E" }}>
                    <Clock size={13} /> {servicio.duracion}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end" style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 24 }}>
            <BotonCoral disabled={!servicioId} onClick={() => setPasoActual(2)}>
              Siguiente Paso →
            </BotonCoral>
          </div>
        </div>
      )}

      {pasoActual === 2 && (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <h2 className="font-display text-2xl font-bold mb-1" style={{ color: COLORES.navy }}>
              Selecciona Fecha y Profesional
            </h2>
            <p className="text-sm" style={{ color: COLORES.azul }}>
              Elige el día y el especialista para tu sesión.
            </p>
          </div>

          {profesionales.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center shadow-sm max-w-lg mx-auto mb-8">
              <Users size={34} className="mx-auto mb-3" style={{ color: COLORES.azulSuave }} />
              <p className="font-display font-bold mb-1" style={{ color: COLORES.navy }}>
                Aún no hay profesionales registrados
              </p>
              <p className="text-sm" style={{ color: COLORES.textoTenue }}>
                La clínica todavía no ha dado de alta especialistas. Intenta más tarde.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <Calendario
                  fechaSeleccionada={fechaElegida}
                  onSeleccionar={(fechaIso) => { setFechaElegida(fechaIso); setHoraElegida(null); }}
                  diasLaborables={doctorElegido?.dias ?? null}
                />
                <div className="mt-6" style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 20 }}>
                  <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>
                    Horarios Disponibles{" "}
                    {fechaElegida
                      ? `(${isoAFecha(fechaElegida).getDate()} ${MESES[isoAFecha(fechaElegida).getMonth()]})`
                      : ""}
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {horariosDelDoctor.map((horario) => {
                      const estaOcupado = horasOcupadas.has(horario);
                      const estaSeleccionado = horaElegida === horario;
                      return (
                        <button
                          key={horario}
                          disabled={estaOcupado || !fechaElegida || !doctorId}
                          onClick={() => setHoraElegida(horario)}
                          className="py-2.5 rounded-xl text-xs font-bold transition-colors"
                          style={
                            estaSeleccionado
                              ? { background: COLORES.verdeSuave, color: COLORES.verde, border: `2px solid ${COLORES.verde}` }
                              : estaOcupado
                              ? { background: "#F3F4FA", color: "#C4C8DE", textDecoration: "line-through", border: "2px solid transparent" }
                              : { background: "#fff", color: COLORES.navySuave, border: `1px solid ${COLORES.borde}` }
                          }
                        >
                          {horario}
                        </button>
                      );
                    })}
                  </div>
                  {(!fechaElegida || !doctorId) && (
                    <p className="text-xs mt-3" style={{ color: COLORES.textoTenue }}>
                      Selecciona un día y un profesional para ver los horarios.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="font-display text-lg font-bold mb-4" style={{ color: COLORES.navy }}>
                  Profesionales Disponibles
                </p>
                <div className="space-y-4">
                  {profesionales.map((doctor) => {
                    const estaSeleccionado = doctorId === doctor.id;
                    return (
                      <button
                        key={doctor.id}
                        onClick={() => elegirDoctor(doctor)}
                        className="w-full bg-white rounded-3xl p-4 text-left shadow-sm transition-shadow hover:shadow-md flex items-center gap-3"
                        style={{
                          border: estaSeleccionado ? `2px solid ${COLORES.verde}` : "2px solid transparent",
                          background: estaSeleccionado ? "#F4FBF8" : "#fff",
                        }}
                      >
                        <AvatarIniciales texto={iniciales(doctor.nombre)} fondo={COLORES.lavanda} />
                        <div className="flex-1">
                          <p
                            className="font-display font-bold"
                            style={{ color: estaSeleccionado ? COLORES.verde : COLORES.navy }}
                          >
                            {doctor.nombre}
                          </p>
                          <p className="text-xs" style={{ color: COLORES.azul }}>{doctor.especialidad}</p>
                        </div>
                        {estaSeleccionado && <Check size={18} style={{ color: COLORES.verde }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between" style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 24 }}>
            <BotonAtras onClick={() => setPasoActual(1)} />
            <BotonCoral
              disabled={!fechaElegida || !doctorId || !horaElegida}
              onClick={() => setPasoActual(3)}
            >
              Siguiente Paso →
            </BotonCoral>
          </div>
        </div>
      )}

      {pasoActual === 3 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-7">
            <h2 className="font-display text-3xl font-bold mb-1" style={{ color: COLORES.navy }}>
              Completa los Detalles
            </h2>
            <p className="text-sm" style={{ color: COLORES.azul }}>
              Confirma tus datos y cuéntanos el motivo de la sesión.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 bg-white rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <p className="text-sm font-bold mb-3" style={{ color: COLORES.navy }}>
                  Datos del paciente <span style={{ color: COLORES.coral }}>*</span>
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Campo
                    label="Nombre(s)"
                    requerido
                    value={firstName}
                    onChange={(evento) => setFirstName(evento.target.value)}
                    placeholder="Ej: Mateo"
                  />
                  <Campo
                    label="Apellidos"
                    requerido
                    value={lastName}
                    onChange={(evento) => setLastName(evento.target.value)}
                    placeholder="Ej: Rodríguez"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Campo
                    label="Teléfono"
                    value={phoneNumber}
                    onChange={(evento) => setPhoneNumber(evento.target.value)}
                    placeholder="312 000 0000"
                  />
                  <Campo
                    label="Correo"
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold mb-1" style={{ color: COLORES.navy }}>
                  Motivo de la consulta <span style={{ color: COLORES.coral }}>*</span>
                </p>
                <p className="text-xs mb-2.5" style={{ color: COLORES.textoTenue }}>
                  Describe brevemente las preocupaciones principales o los síntomas observados.
                </p>
                <textarea
                  value={reason}
                  onChange={(evento) => setReason(evento.target.value)}
                  placeholder="Ej: Dificultades de atención en el colegio, evaluación neuropsicológica general..."
                  rows={4}
                  className="w-full rounded-2xl p-4 text-sm outline-none resize-none"
                  style={{ border: `1px solid ${COLORES.borde}`, color: COLORES.navy, background: "#FBFBFE" }}
                />
              </div>

              <div>
                <p className="text-sm font-bold mb-2.5" style={{ color: COLORES.navy }}>
                  Observaciones para el profesional{" "}
                  <span style={{ color: COLORES.textoTenue, fontWeight: 500 }}>(Opcional)</span>
                </p>
                <textarea
                  value={observations}
                  onChange={(evento) => setObservations(evento.target.value)}
                  placeholder="¿Hay alguna condición médica previa o medicación actual que debamos conocer?"
                  rows={3}
                  className="w-full rounded-2xl p-4 text-sm outline-none resize-none"
                  style={{ border: `1px solid ${COLORES.borde}`, color: COLORES.navy, background: "#FBFBFE" }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm h-fit">
              <p className="font-display text-lg font-bold mb-5" style={{ color: COLORES.navy }}>
                Resumen de Cita
              </p>
              <div className="space-y-4">
                {[
                  { icono: Stethoscope, etiqueta: "Servicio", valor: servicioElegido.etiqueta },
                  { icono: CalendarDays, etiqueta: "Fecha", valor: fechaCorta(fechaElegida) },
                  { icono: Clock, etiqueta: "Hora", valor: `${horaElegida} · ${servicioElegido.duracion}` },
                  { icono: User, etiqueta: "Profesional", valor: doctorElegido.nombre },
                ].map((fila) => {
                  const Icono = fila.icono;
                  return (
                    <div key={fila.etiqueta} className="flex items-start gap-3">
                      <Icono size={16} style={{ color: COLORES.azul, marginTop: 2 }} />
                      <div>
                        <p className="text-xs" style={{ color: COLORES.textoTenue }}>{fila.etiqueta}</p>
                        <p className="text-sm font-bold" style={{ color: COLORES.navy }}>{fila.valor}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div
                className="mt-6 rounded-2xl p-3.5 flex gap-2.5 text-xs"
                style={{ background: COLORES.lavanda, color: COLORES.navySuave }}
              >
                <Info size={14} className="shrink-0 mt-0.5" style={{ color: COLORES.azul }} />
                Podrás revisar todos los detalles en el siguiente paso antes de confirmar.
              </div>
            </div>
          </div>

          <div className="flex justify-between" style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 24 }}>
            <BotonAtras onClick={() => setPasoActual(2)} />
            <BotonCoral disabled={!reason.trim() || !datosPacienteValidos} onClick={() => setPasoActual(4)}>
              Siguiente Paso →
            </BotonCoral>
          </div>
        </div>
      )}

      {pasoActual === 4 && (
        <div className="max-w-3xl mx-auto">
          <div className="mb-7">
            <h2 className="font-display text-3xl font-bold mb-1" style={{ color: COLORES.navy }}>
              Confirma tu Cita
            </h2>
            <p className="text-sm" style={{ color: COLORES.azul }}>
              Revisa que toda la información sea correcta antes de finalizar.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-7 shadow-sm mb-5">
            <p
              className="font-display text-lg font-bold mb-5 flex items-center gap-2"
              style={{ color: COLORES.verde }}
            >
              <ClipboardList size={19} /> <span style={{ color: COLORES.navy }}>Resumen Final</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  etiqueta: "Fecha y Hora",
                  valor: fechaLarga(fechaElegida),
                  detalle: `${horaElegida} · ${servicioElegido.duracion}`,
                  icono: CalendarDays,
                },
                {
                  etiqueta: "Especialista",
                  valor: doctorElegido.nombre,
                  detalle: doctorElegido.especialidad,
                  icono: User,
                },
                {
                  etiqueta: "Paciente",
                  valor: `${firstName.trim()} ${lastName.trim()}`,
                  detalle: phoneNumber.trim() || email.trim() || "Sin contacto",
                  icono: MapPin,
                },
                {
                  etiqueta: "Servicio",
                  valor: servicioElegido.nombre,
                  detalle: servicioElegido.etiqueta,
                  icono: Stethoscope,
                },
              ].map((fila) => {
                const Icono = fila.icono;
                return (
                  <div key={fila.etiqueta} className="rounded-2xl p-4 flex gap-3" style={{ background: "#F8F8FC" }}>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: COLORES.verdeSuave }}
                    >
                      <Icono size={17} style={{ color: COLORES.verde }} />
                    </div>
                    <div>
                      <p className="text-xs mb-0.5" style={{ color: COLORES.textoTenue }}>{fila.etiqueta}</p>
                      <p className="text-sm font-bold" style={{ color: COLORES.navy }}>{fila.valor}</p>
                      <p className="text-xs font-semibold" style={{ color: COLORES.verde }}>{fila.detalle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl p-5 mb-8" style={{ background: "#FDEFE9" }}>
            <p className="text-sm font-bold mb-1 flex items-center gap-2" style={{ color: "#D96A46" }}>
              <Info size={15} /> Política de Cancelación
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#B36249" }}>
              Las cancelaciones o reprogramaciones deben realizarse con al menos{" "}
              <b>24 horas de antelación</b>. De lo contrario, podría aplicarse un cargo administrativo.
            </p>
          </div>

          <div className="flex justify-between" style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 24 }}>
            <BotonAtras onClick={() => setPasoActual(3)} />
            <BotonCoral onClick={confirmarReserva}>Confirmar y Finalizar Reserva ✓</BotonCoral>
          </div>
        </div>
      )}
    </div>
  );
}