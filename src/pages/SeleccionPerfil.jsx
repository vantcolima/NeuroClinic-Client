import { useState } from "react";
import { ChevronLeft, UserPlus } from "lucide-react";
import { COLORES } from "../constantes";
import { iniciales, nombreCompletoPaciente } from "../utils";
import { AvatarIniciales, Campo } from "../components/Comunes";

export default function SeleccionPerfil({ rol, perfiles, onSeleccionar, onCrear, onVolver }) {
  const [creandoPerfil, setCreandoPerfil] = useState(perfiles.length === 0);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const esProfesional = rol === "profesional";
  const formularioValido = esProfesional
    ? nombre.trim() && especialidad.trim()
    : nombre.trim() && apellidos.trim();

  const crearPerfil = () => {
    onCrear(
      esProfesional
        ? { nombre: nombre.trim(), especialidad: especialidad.trim() }
        : {
            firstName: nombre.trim(),
            lastName: apellidos.trim(),
            phoneNumber: telefono.trim(),
            email: correo.trim(),
            generalNotes: "",
          }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: COLORES.fondo }}>
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-md">
        <button
          onClick={onVolver}
          className="text-xs font-bold mb-5 flex items-center gap-1"
          style={{ color: COLORES.azul }}
        >
          <ChevronLeft size={14} /> Volver al inicio de sesión
        </button>

        <h1 className="font-display text-2xl font-bold mb-1" style={{ color: COLORES.navy }}>
          {creandoPerfil ? (esProfesional ? "Crea tu perfil profesional" : "Crea tu perfil") : "¿Quién eres?"}
        </h1>
        <p className="text-sm mb-7" style={{ color: COLORES.azul }}>
          {creandoPerfil
            ? "Completa tus datos para entrar a tu portal."
            : `Selecciona tu perfil de ${esProfesional ? "profesional" : "paciente"}.`}
        </p>

        {!creandoPerfil ? (
          <>
            <div className="space-y-3 mb-5">
              {perfiles.map((perfil) => {
                const nombrePerfil = esProfesional ? perfil.nombre : nombreCompletoPaciente(perfil);
                return (
                  <button
                    key={perfil.id}
                    onClick={() => onSeleccionar(perfil.id)}
                    className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left transition-colors hover:shadow-sm"
                    style={{ border: `1px solid ${COLORES.borde}` }}
                  >
                    <AvatarIniciales
                      texto={iniciales(nombrePerfil)}
                      fondo={esProfesional ? COLORES.lavanda : COLORES.verdeSuave}
                      color={esProfesional ? COLORES.navy : COLORES.verdeOscuro}
                      tamano={40}
                      tamanoFuente={13}
                    />
                    <div>
                      <p className="text-sm font-bold" style={{ color: COLORES.navy }}>{nombrePerfil}</p>
                      {perfil.especialidad && (
                        <p className="text-xs" style={{ color: COLORES.azul }}>{perfil.especialidad}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCreandoPerfil(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-colors"
              style={{ color: COLORES.verde, border: `2px dashed ${COLORES.verde}` }}
            >
              <UserPlus size={16} /> Crear un perfil nuevo
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-7">
              {esProfesional ? (
                <>
                  <Campo
                    label="Nombre completo"
                    requerido
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                    placeholder="Ej: Dra. Elena Ruiz"
                  />
                  <Campo
                    label="Especialidad"
                    requerido
                    value={especialidad}
                    onChange={(evento) => setEspecialidad(evento.target.value)}
                    placeholder="Ej: Neuropsicóloga Clínica"
                  />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo
                      label="Nombre(s)"
                      requerido
                      value={nombre}
                      onChange={(evento) => setNombre(evento.target.value)}
                      placeholder="Ej: Mateo"
                    />
                    <Campo
                      label="Apellidos"
                      requerido
                      value={apellidos}
                      onChange={(evento) => setApellidos(evento.target.value)}
                      placeholder="Ej: Rodríguez"
                    />
                  </div>
                  <Campo
                    label="Teléfono (opcional)"
                    value={telefono}
                    onChange={(evento) => setTelefono(evento.target.value)}
                    placeholder="Ej: 312 000 0000"
                  />
                  <Campo
                    label="Correo (opcional)"
                    type="email"
                    value={correo}
                    onChange={(evento) => setCorreo(evento.target.value)}
                    placeholder="correo@ejemplo.com"
                  />
                </>
              )}
            </div>
            <div className="flex gap-3">
              {perfiles.length > 0 && (
                <button
                  onClick={() => setCreandoPerfil(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold bg-white"
                  style={{ color: COLORES.navy, border: `1px solid ${COLORES.borde}` }}
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={crearPerfil}
                disabled={!formularioValido}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-opacity ${
                  formularioValido ? "hover:opacity-90" : "opacity-40 cursor-not-allowed"
                }`}
                style={{ background: COLORES.coral }}
              >
                Entrar a mi portal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}