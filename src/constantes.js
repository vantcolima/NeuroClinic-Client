import { Brain, ClipboardList } from "lucide-react";

export const COLORES = {
  fondo: "#F6F5FB",
  navy: "#1D2A5E",
  navySuave: "#2B3A75",
  azul: "#5B7BC7",
  azulSuave: "#8FA5D8",
  coral: "#F9855F",
  verde: "#52C5A5",
  verdeSuave: "#E2F6EF",
  verdeOscuro: "#2E9E7E",
  lavanda: "#EEF0FB",
  borde: "#E7E8F3",
  textoTenue: "#8A93B5",
  rojo: "#EF6A6A",
  rojoSuave: "#FDECEC",
};

export const SERVICIOS = [
  {
    id: "terapia",
    nombre: "Terapia",
    etiqueta: "Terapia Neuropsicológica",
    descripcion:
      "Sesión regular de seguimiento y actividades terapéuticas guiadas.",
    duracion: "45 min",
    duracionMinutos: 45,
    icono: Brain,
  },
  {
    id: "evaluacion",
    nombre: "Evaluación",
    etiqueta: "Evaluación Neuropsicológica",
    descripcion:
      "Pruebas neuropsicológicas completas para diagnóstico inicial o revisión.",
    duracion: "90 min",
    duracionMinutos: 90,
    icono: ClipboardList,
  },
];

export const ESTADO_AGENDADA = 1;
export const ESTADO_CANCELADA = 2;
export const ESTADO_COMPLETADA = 3;

export const DURACION_CITA_MINUTOS = 60;

export const HORARIOS = [
  "09:00 AM",
  "10:30 AM",
  "12:00 PM",
  "02:00 PM",
  "03:30 PM",
  "05:00 PM",
];

export const DISPONIBILIDAD_DEFAULT = {
  dias: [1, 2, 3, 4, 5],
  horarios: [...HORARIOS],
};

export const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
export const DIAS_SEMANA_LARGOS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
