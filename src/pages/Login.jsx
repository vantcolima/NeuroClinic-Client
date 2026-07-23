import { useState } from "react";
import { Brain, ShieldCheck } from "lucide-react";
import { COLORES } from "../constantes";
import { Campo } from "../components/Comunes";

export default function Login({ onIngresar, onVolverAlInicio }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("paciente");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLORES.fondo }}>
      <header
        className="px-8 py-4 bg-white flex items-center justify-between"
        style={{ borderBottom: `1px solid ${COLORES.borde}` }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: COLORES.lavanda }}>
            <Brain size={16} style={{ color: COLORES.navy }} />
          </div>
          <p className="font-display font-bold text-lg" style={{ color: COLORES.navy }}>NeuroClinic</p>
        </div>
        <button onClick={onVolverAlInicio} className="text-sm font-bold" style={{ color: COLORES.azul }}>
          ← Volver al inicio
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-6">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-md">
          <h1 className="font-display text-2xl font-bold text-center mb-1" style={{ color: COLORES.navy }}>
            Bienvenido a NeuroClinic
          </h1>
          <p className="text-sm text-center mb-7" style={{ color: COLORES.azul }}>
            Accede a tu portal de salud
          </p>

          <div className="flex rounded-full p-1 mb-6" style={{ background: COLORES.lavanda }}>
            {[
              { id: "paciente", label: "Paciente" },
              { id: "profesional", label: "Profesional" },
            ].map((opcionRol) => (
              <button
                key={opcionRol.id}
                onClick={() => setRolSeleccionado(opcionRol.id)}
                className="flex-1 py-1.5 rounded-full text-xs font-bold transition-colors"
                style={
                  rolSeleccionado === opcionRol.id
                    ? { background: COLORES.navy, color: "#fff" }
                    : { color: COLORES.navySuave }
                }
              >
                {opcionRol.label}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-3">
            <Campo
              label="Correo electrónico"
              type="email"
              value={correo}
              onChange={(evento) => setCorreo(evento.target.value)}
              placeholder="ejemplo@correo.com"
            />
            <Campo
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="text-right mb-6">
            <button className="text-xs font-semibold" style={{ color: COLORES.azul }}>
              ¿Olvidé mi contraseña?
            </button>
          </div>

          <button
            onClick={() => onIngresar(rolSeleccionado)}
            className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ background: COLORES.coral }}
          >
            Iniciar Sesión
          </button>
        </div>

        <div className="w-full max-w-sm rounded-3xl p-6 flex gap-4 items-start" style={{ background: COLORES.verde }}>
          <ShieldCheck size={30} className="text-white shrink-0 mt-1" />
          <div>
            <p className="font-display font-bold text-white mb-1">Tu información, nuestra prioridad.</p>
            <p className="text-xs leading-relaxed" style={{ color: "#E4F8F1" }}>
              Seguridad y confidencialidad garantizada en cada paso de tu tratamiento
              neuropsicológico. Cumplimos con los más altos estándares de protección de datos médicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}