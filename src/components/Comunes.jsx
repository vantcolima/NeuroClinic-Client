import { Brain } from "lucide-react";
import { COLORES, ESTADO_AGENDADA, ESTADO_CANCELADA, ESTADO_COMPLETADA } from "../constantes";

export function Logo({ subtitulo }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: COLORES.lavanda }}>
        <Brain size={20} style={{ color: COLORES.navy }} />
      </div>
      <div>
        <p className="font-display font-bold text-lg leading-tight" style={{ color: COLORES.navy }}>
          NeuroClinic
        </p>
        <p className="text-xs" style={{ color: COLORES.azul }}>{subtitulo}</p>
      </div>
    </div>
  );
}

export function AvatarIniciales({ texto, fondo = COLORES.lavanda, color = COLORES.navy, tamano = 44, tamanoFuente = 14 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{ width: tamano, height: tamano, background: fondo, color, fontSize: tamanoFuente }}
    >
      {texto}
    </div>
  );
}

export function EstadoChip({ estadoId }) {
  const estilos = {
    [ESTADO_AGENDADA]: { fondo: COLORES.verdeSuave, color: COLORES.verdeOscuro, texto: "Agendada" },
    [ESTADO_COMPLETADA]: { fondo: COLORES.lavanda, color: COLORES.azul, texto: "Completada" },
    [ESTADO_CANCELADA]: { fondo: COLORES.rojoSuave, color: COLORES.rojo, texto: "Cancelada" },
  };
  const estilo = estilos[estadoId] || estilos[ESTADO_AGENDADA];
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: estilo.fondo, color: estilo.color }}>
      {estilo.texto}
    </span>
  );
}

export function BotonCoral({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-7 py-3 rounded-full text-sm font-bold text-white shadow-md transition-opacity ${
        disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"
      } ${className}`}
      style={{ background: COLORES.coral }}
    >
      {children}
    </button>
  );
}

export function BotonAtras({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-full text-sm font-bold bg-white transition-colors"
      style={{ color: COLORES.navy, border: `1px solid ${COLORES.borde}` }}
    >
      ← Atrás
    </button>
  );
}

export function Campo({ label, requerido, ...propiedades }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: COLORES.navy }}>
        {label} {requerido && <span style={{ color: COLORES.coral }}>*</span>}
      </label>
      <input
        {...propiedades}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={{ border: `1px solid ${COLORES.borde}`, color: COLORES.navy, background: "#FBFBFE" }}
      />
    </div>
  );
}