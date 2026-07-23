const API_URL = import.meta.env?.VITE_API_URL || "";

const RUTA_CITAS_POR_FECHA = "/appointments/by-date";
const RUTA_CREAR_CITA = "/appointments";

function Get(url, params = {}, headers = {}) {
  const queryString = new URLSearchParams(params).toString();
  const urlCompleta = queryString ? `${url}?${queryString}` : url;
  return fetch(urlCompleta, { method: "GET", headers });
}

function Post(url, body = {}, headers = {}) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

export async function obtenerCitasPorFecha(fechaIso) {
  if (!API_URL) return [];
  const respuesta = await Get(`${API_URL}${RUTA_CITAS_POR_FECHA}`, {
    date: fechaIso,
  });
  if (!respuesta.ok) throw new Error("No se pudieron cargar los horarios");
  return respuesta.json();
}

export async function crearCita(datosCita) {
  if (!API_URL) return { ...datosCita, simulada: true };
  const respuesta = await Post(`${API_URL}${RUTA_CREAR_CITA}`, datosCita);
  if (!respuesta.ok) throw new Error("No se pudo agendar la cita");
  return respuesta.json();
}
