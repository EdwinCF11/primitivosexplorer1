export type SubjectId = "matematica" | "ciencias" | "sociales" | "lengua" | "arte";

export const SUBJECTS: { id: SubjectId; label: string; short: string }[] = [
  { id: "matematica", label: "Matemática", short: "Mat" },
  { id: "ciencias", label: "Ciencias Naturales", short: "CCNN" },
  { id: "sociales", label: "Ciencias Sociales", short: "CCSS" },
  { id: "lengua", label: "Lengua Española", short: "Leng" },
  { id: "arte", label: "Educación Artística", short: "Arte" },
];

export const subjectLabel = (id: SubjectId) => SUBJECTS.find((s) => s.id === id)?.label ?? id;

export const EXCURSION_TYPES = [
  "Cultural",
  "Histórico",
  "Naturaleza",
  "Aventura",
  "Museo",
  "Ciencia",
] as const;
export type ExcursionType = (typeof EXCURSION_TYPES)[number];

/** Estado de acceso real del sitio para grupos escolares */
export type AccessStatus = "libre" | "reserva" | "restringido";

export const ACCESS_META: Record<AccessStatus, { label: string; tone: string; note: string }> = {
  libre: { label: "Acceso abierto", tone: "bg-fern text-cream", note: "Entrada regular para grupos escolares." },
  reserva: { label: "Requiere reserva", tone: "bg-sun text-ink", note: "Es obligatorio reservar el cupo del grupo con antelación." },
  restringido: {
    label: "Acceso restringido",
    tone: "bg-terra text-cream",
    note: "El acceso interior puede estar limitado: confirma autorización antes de organizar la visita.",
  },
};

export interface CurricularLink {
  subject: SubjectId;
  title: string;
  points: string[];
}

export interface ItineraryStep {
  time: string;
  title: string;
  detail: string;
}

export interface Guide {
  objetivos: string[];
  antes: string[];
  durante: string[];
  despues: string[];
  vocabulario: string[];
}

export interface RawDestination {
  id: string;
  name: string;
  tagline: string;
  province: string;
  region: string;
  type: ExcursionType;
  level: string;
  grades: string;
  subjects: SubjectId[];
  access: AccessStatus;
  accessNote?: string;
  pricePerStudent: number;
  lunchPrice?: number;
  busCapacity?: number;
  coords: [number, number];
  distanceKm: number;
  travelTime: string;
  duration: string;
  bestSeason: string;
  featured?: boolean;
  image: string;
  gallery: string[];
  description: string[];
  curiosities: string[];
  curricular: CurricularLink[];
  safety: string[];
  vocabulario: string[];
  itinerary?: ItineraryStep[];
  guide?: Partial<Guide>;
}

export interface Destination extends Required<Omit<RawDestination, "guide" | "accessNote" | "itinerary">> {
  slug: string;
  busCost: number;
  guide: Guide;
  itinerary: ItineraryStep[];
  accessNote: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Costo de autobús: tarifa base + kilometraje ida y vuelta */
const busCostFor = (km: number) => Math.round((11000 + km * 115) / 500) * 500;

function defaultItinerary(d: RawDestination): ItineraryStep[] {
  const far = d.distanceKm > 120;
  return [
    {
      time: far ? "5:30 a. m." : "7:30 a. m.",
      title: "Salida del centro educativo",
      detail: "Lista de asistencia, asignación de equipos de exploración y repaso de las normas de convivencia.",
    },
    {
      time: far ? "9:00 a. m." : "8:30 a. m.",
      title: `Llegada a ${d.name}`,
      detail: "Charla de bienvenida, protocolo de seguridad del sitio y entrega del cuaderno de campo.",
    },
    {
      time: far ? "9:45 a. m." : "9:15 a. m.",
      title: "Recorrido guiado principal",
      detail: `Visita conducida por el guía del sitio con estaciones de observación vinculadas a ${d.subjects
        .map(subjectLabel)
        .join(" y ")}.`,
    },
    {
      time: far ? "11:15 a. m." : "10:45 a. m.",
      title: "Taller pedagógico en terreno",
      detail: "Trabajo por equipos con la ficha de campo: observar, registrar, inferir y formular preguntas.",
    },
    { time: "12:30 p. m.", title: "Almuerzo y descanso", detail: "Hidratación, merienda y tiempo libre supervisado en zona habilitada." },
    {
      time: "1:30 p. m.",
      title: "Cierre y puesta en común",
      detail: "Cada equipo comparte su hallazgo principal y se evalúa el cumplimiento de los objetivos del día.",
    },
    { time: far ? "2:30 p. m." : "2:00 p. m.", title: "Regreso", detail: "Conteo de asistencia, abordaje ordenado y retorno al centro educativo." },
  ];
}

function defaultGuide(d: RawDestination): Guide {
  const subjects = d.subjects.map(subjectLabel).join(", ");
  return {
    objetivos: d.curricular.map((c) => `${c.title}: ${c.points[0]}`).slice(0, 4),
    antes: [
      `Activar conocimientos previos sobre ${d.name} con una lluvia de ideas y registrar las predicciones del grupo.`,
      `Presentar el vocabulario clave (${d.vocabulario.slice(0, 4).join(", ")}) y pedir definiciones provisionales.`,
      "Formar equipos de 4 y asignar roles: cronista, cronometrista, cartógrafo y portavoz.",
    ],
    durante: [
      "Completar la tabla “lo que veo / lo que infiero / lo que pregunto” en tres estaciones del recorrido.",
      `Registrar en la bitácora al menos tres evidencias relacionadas con ${subjects}.`,
      "Entrevista relámpago al guía del sitio: cada equipo formula una pregunta preparada.",
      "Croquis o fotografía anotada del elemento que más impactó al equipo.",
    ],
    despues: [
      "Puesta en común en el aula: cada equipo presenta su hallazgo en 90 segundos.",
      "Producción final (cartel, infografía o texto) que responda la pregunta de investigación del viaje.",
      "Autoevaluación del aprendizaje y comparación con las predicciones iniciales.",
    ],
    vocabulario: d.vocabulario,
  };
}

export function normalize(raw: RawDestination): Destination {
  return {
    ...raw,
    slug: slugify(raw.name),
    featured: raw.featured ?? false,
    lunchPrice: raw.lunchPrice ?? 380,
    busCapacity: raw.busCapacity ?? 44,
    busCost: busCostFor(raw.distanceKm),
    accessNote: raw.accessNote ?? ACCESS_META[raw.access].note,
    itinerary: raw.itinerary ?? defaultItinerary(raw),
    guide: { ...defaultGuide(raw), ...raw.guide },
  };
}
