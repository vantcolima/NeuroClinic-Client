import { DIAS_SEMANA_LARGOS, MESES } from "./constantes";

export const hoy = new Date();

export const fechaAIso = (fecha) =>
  `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

export const agregarDias = (fechaBase, cantidadDias) => {
  const nuevaFecha = new Date(fechaBase);
  nuevaFecha.setDate(nuevaFecha.getDate() + cantidadDias);
  return nuevaFecha;
};

export const isoAFecha = (fechaIso) => {
  const [anio, mes, dia] = fechaIso.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
};

export const fechaLarga = (fechaIso) => {
  const fecha = isoAFecha(fechaIso);
  return `${DIAS_SEMANA_LARGOS[fecha.getDay()]} ${fecha.getDate()} de ${MESES[fecha.getMonth()]}`;
};

export const fechaCorta = (fechaIso) => {
  const fecha = isoAFecha(fechaIso);
  return `${fecha.getDate()} ${MESES[fecha.getMonth()]}, ${fecha.getFullYear()}`;
};

export const iniciales = (nombreCompleto) =>
  nombreCompleto
    .trim()
    .split(/\s+/)
    .map((palabra) => palabra[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const nombreCompletoPaciente = (paciente) =>
  `${paciente.firstName || ""} ${paciente.lastName || ""}`.trim();

export const etiquetaHoraA24 = (etiquetaHora) => {
  const [horaMinutos, periodo] = etiquetaHora.split(" ");
  let [horas, minutos] = horaMinutos.split(":").map(Number);
  if (periodo === "PM" && horas !== 12) horas += 12;
  if (periodo === "AM" && horas === 12) horas = 0;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}`;
};

export const hora24AEtiqueta = (hora24) => {
  let [horas, minutos] = hora24.split(":").map(Number);
  const periodo = horas >= 12 ? "PM" : "AM";
  if (horas === 0) horas = 12;
  else if (horas > 12) horas -= 12;
  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")} ${periodo}`;
};

export const construirFechaHora = (fechaIso, etiquetaHora) =>
  `${fechaIso}T${etiquetaHoraA24(etiquetaHora)}:00`;

export const sumarMinutos = (fechaHora, minutos) => {
  const fecha = new Date(fechaHora);
  fecha.setMinutes(fecha.getMinutes() + minutos);
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutosTexto = String(fecha.getMinutes()).padStart(2, "0");
  return `${fechaAIso(fecha)}T${horas}:${minutosTexto}:00`;
};

export const fechaDeCita = (cita) => cita.start_date.slice(0, 10);

export const horaDeCita = (cita) =>
  hora24AEtiqueta(cita.start_date.slice(11, 16));
