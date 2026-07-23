import { HelpCircle, LogOut } from "lucide-react";
import { COLORES } from "../constantes";
import { Logo } from "./Comunes";

export default function Sidebar({ subtitulo, items, seccionActiva, onCambiarSeccion, botonPrincipal, onCerrarSesion }) {
  return (
    <aside
      className="w-64 shrink-0 flex flex-col bg-white p-5 gap-6"
      style={{ borderRight: `1px solid ${COLORES.borde}` }}
    >
      <Logo subtitulo={subtitulo} />
      {botonPrincipal}
      <nav className="flex flex-col gap-1.5 flex-1">
        {items.map((item) => {
          const Icono = item.icono;
          const esActiva = seccionActiva === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onCambiarSeccion(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors"
              style={esActiva ? { background: COLORES.navy, color: "#fff" } : { color: COLORES.navySuave }}
            >
              <Icono size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="flex flex-col gap-1" style={{ borderTop: `1px solid ${COLORES.borde}`, paddingTop: 16 }}>
        <button className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold" style={{ color: COLORES.navySuave }}>
          <HelpCircle size={17} /> Ayuda
        </button>
        <button
          onClick={onCerrarSesion}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold"
          style={{ color: COLORES.navySuave }}
        >
          <LogOut size={17} /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}