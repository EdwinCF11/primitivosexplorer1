import type { Destination } from "../data/types";

export const FREE_TEACHER_RATIO = 10; // 1 docente cortesía por cada 10 estudiantes

export interface ExtraDef {
  id: string;
  label: string;
  detail: string;
  price: number;
  /** a quién se le cobra */
  scope: "todos" | "estudiantes" | "grupo";
  icon: string;
}

/** Servicios opcionales del programa */
export const EXTRAS: ExtraDef[] = [
  { id: "almuerzo", label: "Almuerzo y merienda", detail: "Buffet o lunch escolar por persona", price: 0, scope: "todos", icon: "utensils" },
  { id: "seguro", label: "Seguro de accidentes", detail: "Póliza escolar por persona", price: 120, scope: "todos", icon: "shield" },
  { id: "kit", label: "Kit de campo Primitivos", detail: "Cuaderno de bitácora, lápiz y lupa", price: 95, scope: "estudiantes", icon: "notebook" },
  { id: "fotografo", label: "Reportaje fotográfico", detail: "Fotógrafo del viaje y álbum digital", price: 4500, scope: "grupo", icon: "camera" },
  { id: "brigadista", label: "Brigadista de primeros auxilios", detail: "Personal certificado dedicado al grupo", price: 3800, scope: "grupo", icon: "cross" },
];

export type LineKind = "entrada" | "transporte" | "extra";

export interface TripLine {
  id: string;
  kind: LineKind;
  /** id del destino o del extra al que pertenece */
  refId: string;
  label: string;
  detail: string;
  amount: number;
  removable: boolean;
}

export interface TripState {
  destIds: string[];
  students: number;
  extraIds: string[];
  /** el centro aporta su propio transporte */
  ownTransport: boolean;
}

export interface Trip {
  dests: Destination[];
  students: number;
  teachers: number;
  seats: number;
  buses: number;
  totalKm: number;
  lines: TripLine[];
  subtotalEntradas: number;
  subtotalTransporte: number;
  subtotalExtras: number;
  total: number;
  perStudent: number;
  perStudentRounded: number;
  days: number;
}

export const teachersFor = (students: number) => Math.max(1, Math.ceil(students / FREE_TEACHER_RATIO));

export function formatDOP(n: number): string {
  return "RD$ " + Math.round(n).toLocaleString("es-DO");
}

/**
 * Motor de cálculo. Es una función pura: cualquier cambio en el estado
 * (añadir o eliminar un destino, un servicio o cambiar el número de alumnos)
 * regenera todas las líneas y todos los totales.
 */
export function computeTrip(state: TripState, all: Destination[]): Trip {
  const dests = state.destIds.map((id) => all.find((d) => d.id === id)).filter((d): d is Destination => Boolean(d));

  const students = Math.min(500, Math.max(1, Math.round(state.students || 0)));
  const teachers = teachersFor(students);
  const seats = students + teachers;
  const capacity = dests.length ? Math.min(...dests.map((d) => d.busCapacity)) : 44;
  const buses = Math.max(1, Math.ceil(seats / capacity));

  const lines: TripLine[] = [];

  // ---- entradas por destino ----
  dests.forEach((d) => {
    lines.push({
      id: `entrada-${d.id}`,
      kind: "entrada",
      refId: d.id,
      label: `${d.name} · entradas y guía`,
      detail: `${students} estud. × ${formatDOP(d.pricePerStudent)}`,
      amount: students * d.pricePerStudent,
      removable: true,
    });
  });

  // ---- transporte ----
  const farthest = dests.length ? Math.max(...dests.map((d) => d.distanceKm)) : 0;
  const extraStops = Math.max(0, dests.length - 1);
  const totalKm = Math.round(farthest * 2 + extraStops * 18);
  let subtotalTransporte = 0;

  if (!state.ownTransport && dests.length) {
    const base = Math.max(...dests.map((d) => d.busCost));
    const stopsSurcharge = Math.round(base * 0.12 * extraStops);
    subtotalTransporte = (base + stopsSurcharge) * buses;
    lines.push({
      id: "transporte",
      kind: "transporte",
      refId: "transporte",
      label: `Transporte · ${buses} autobús${buses > 1 ? "es" : ""}`,
      detail:
        `${buses} × ${formatDOP(base + stopsSurcharge)} · ida y vuelta (~${totalKm} km)` +
        (extraStops ? ` · ${extraStops} parada(s) adicional(es)` : ""),
      amount: subtotalTransporte,
      removable: true,
    });
  }

  // ---- extras ----
  state.extraIds.forEach((exId) => {
    const ex = EXTRAS.find((e) => e.id === exId);
    if (!ex) return;

    let amount = 0;
    let detail = "";

    if (ex.id === "almuerzo") {
      // el precio del almuerzo lo define cada destino
      amount = dests.reduce((acc, d) => acc + d.lunchPrice * seats, 0);
      detail = dests.length
        ? `${seats} pers. × ${dests.map((d) => formatDOP(d.lunchPrice)).join(" + ")}`
        : "Sin destinos seleccionados";
    } else if (ex.scope === "grupo") {
      amount = ex.price;
      detail = `Tarifa única por grupo · ${formatDOP(ex.price)}`;
    } else {
      const people = ex.scope === "todos" ? seats : students;
      amount = ex.price * people;
      detail = `${people} ${ex.scope === "todos" ? "pers." : "estud."} × ${formatDOP(ex.price)}`;
    }

    lines.push({
      id: `extra-${ex.id}`,
      kind: "extra",
      refId: ex.id,
      label: ex.label,
      detail,
      amount,
      removable: true,
    });
  });

  const subtotalEntradas = lines.filter((l) => l.kind === "entrada").reduce((a, l) => a + l.amount, 0);
  const subtotalExtras = lines.filter((l) => l.kind === "extra").reduce((a, l) => a + l.amount, 0);
  const total = subtotalEntradas + subtotalTransporte + subtotalExtras;
  const perStudent = students ? total / students : 0;

  return {
    dests,
    students,
    teachers,
    seats,
    buses,
    totalKm,
    lines,
    subtotalEntradas,
    subtotalTransporte,
    subtotalExtras,
    total,
    perStudent,
    perStudentRounded: Math.ceil(perStudent / 10) * 10,
    days: dests.length > 2 ? 2 : 1,
  };
}
