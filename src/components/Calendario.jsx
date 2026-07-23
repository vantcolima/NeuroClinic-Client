import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORES, DIAS_SEMANA, MESES } from "../constantes";
import { hoy, fechaAIso } from "../utils";

export default function Calendario({
  fechaSeleccionada,
  onSeleccionar,
  diasConCitas = {},
  permitirPasado = false,
  diasLaborables = null,
}) {
  const [mesVisible, setMesVisible] = useState(() => new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  const anio = mesVisible.getFullYear();
  const mes = mesVisible.getMonth();
  const primerDiaSemana = new Date(anio, mes, 1).getDay();
  const diasEnMes = new Date(anio, mes + 1, 0).getDate();
  const hoyIso = fechaAIso(hoy);

  const celdas = [];
  for (let vacio = 0; vacio < primerDiaSemana; vacio++) celdas.push(null);
  for (let numeroDia = 1; numeroDia <= diasEnMes; numeroDia++) celdas.push(numeroDia);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMesVisible(new Date(anio, mes - 1, 1))}
          className="p-2 rounded-full"
          style={{ color: COLORES.azul }}
          aria-label="Mes anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="font-display font-bold text-lg" style={{ color: COLORES.navy }}>
          {MESES[mes]} {anio}
        </p>
        <button
          onClick={() => setMesVisible(new Date(anio, mes + 1, 1))}
          className="p-2 rounded-full"
          style={{ color: COLORES.azul }}
          aria-label="Mes siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA.map((nombreDia) => (
          <span key={nombreDia} className="text-xs font-bold py-1" style={{ color: COLORES.textoTenue }}>
            {nombreDia}
          </span>
        ))}
        {celdas.map((numeroDia, indice) => {
          if (numeroDia === null) return <span key={`vacio-${indice}`} />;
          const fechaDia = new Date(anio, mes, numeroDia);
          const fechaIso = fechaAIso(fechaDia);
          const esPasado = fechaIso < hoyIso;
          const esNoLaborable = diasLaborables !== null && !diasLaborables.includes(fechaDia.getDay());
          const estaBloqueado = (esPasado && !permitirPasado) || esNoLaborable;
          const estaSeleccionado = fechaSeleccionada === fechaIso;
          const numeroCitas = diasConCitas[fechaIso] || 0;
          return (
            <button
              key={fechaIso}
              disabled={estaBloqueado}
              onClick={() => onSeleccionar(fechaIso)}
              className="relative aspect-square rounded-full text-sm font-semibold transition-colors flex flex-col items-center justify-center"
              style={
                estaSeleccionado
                  ? { background: COLORES.verde, color: "#fff" }
                  : estaBloqueado
                  ? { color: "#C9CDE2" }
                  : fechaIso === hoyIso
                  ? { color: COLORES.coral, fontWeight: 800 }
                  : esPasado
                  ? { color: COLORES.textoTenue }
                  : { color: COLORES.navySuave }
              }
            >
              {numeroDia}
              {numeroCitas > 0 && (
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    bottom: 4,
                    background: estaSeleccionado ? "#fff" : COLORES.coral,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}