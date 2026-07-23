import { useState } from "react";
import { UserPlus } from "lucide-react";
import { COLORES } from "../constantes";
import { Campo, BotonCoral } from "./Comunes";

export default function FormNuevoPaciente({ onGuardar, onCancelar }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");

  const formularioValido = firstName.trim() && lastName.trim();

  return (
    <div className="bg-white rounded-3xl p-7 shadow-sm max-w-xl">
      <p className="font-display text-lg font-bold mb-5 flex items-center gap-2" style={{ color: COLORES.navy }}>
        <UserPlus size={19} style={{ color: COLORES.verde }} /> Nuevo Paciente
      </p>
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className="block text-xs font-bold mb-1.5" style={{ color: COLORES.navy }}>
            Notas generales (opcional)
          </label>
          <textarea
            value={generalNotes}
            onChange={(evento) => setGeneralNotes(evento.target.value)}
            placeholder="Antecedentes, condiciones médicas u otra información relevante..."
            rows={3}
            className="w-full rounded-2xl p-4 text-sm outline-none resize-none"
            style={{ border: `1px solid ${COLORES.borde}`, color: COLORES.navy, background: "#FBFBFE" }}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancelar}
          className="px-6 py-3 rounded-full text-sm font-bold bg-white"
          style={{ color: COLORES.navy, border: `1px solid ${COLORES.borde}` }}
        >
          Cancelar
        </button>
        <BotonCoral
          disabled={!formularioValido}
          onClick={() =>
            onGuardar({
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              phoneNumber: phoneNumber.trim(),
              email: email.trim(),
              generalNotes: generalNotes.trim(),
            })
          }
        >
          Guardar Paciente ✓
        </BotonCoral>
      </div>
    </div>
  );
}