import { Check } from "lucide-react";
import { COLORES } from "../constantes";

export default function Stepper({ pasos, pasoActual }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10 max-w-2xl mx-auto w-full">
      {pasos.map((nombrePaso, indice) => {
        const numeroPaso = indice + 1;
        const estaCompletado = numeroPaso < pasoActual;
        const estaActivo = numeroPaso === pasoActual;
        return (
          <div key={nombrePaso} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={
                  estaCompletado
                    ? { background: COLORES.verdeSuave, color: COLORES.verde, border: `2px solid ${COLORES.verde}` }
                    : estaActivo
                    ? { background: COLORES.navy, color: "#fff" }
                    : { background: "#fff", color: COLORES.textoTenue, border: `1px solid ${COLORES.borde}` }
                }
              >
                {estaCompletado ? <Check size={16} strokeWidth={3} /> : numeroPaso}
              </div>
              <span
                className="text-xs font-semibold whitespace-nowrap"
                style={{ color: estaCompletado ? COLORES.verde : estaActivo ? COLORES.navy : COLORES.textoTenue }}
              >
                {nombrePaso}
              </span>
            </div>
            {indice < pasos.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 -mt-5 rounded"
                style={{ background: estaCompletado ? COLORES.verde : COLORES.borde }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}