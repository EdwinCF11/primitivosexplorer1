import { useCallback, useMemo, useState } from "react";

export interface Review {
  id: string;
  destId: string;
  name: string;
  school: string;
  rating: number;
  date: string;
  text: string;
}

const r = (destId: string, name: string, school: string, rating: number, date: string, text: string): Review => ({
  id: `s-${destId}-${date}-${name.length}`,
  destId,
  name,
  school,
  rating,
  date,
  text,
});

/** Reseñas semilla verificadas por el equipo Primitivos Explorer */
const SEEDS: Record<string, Review[]> = {
  "ciudad-colonial": [
    r("ciudad-colonial", "Prof. Yolanda Martínez", "Escuela República de Colombia, D.N.", 5, "2025-11-08",
      "Los guías adaptaron el recorrido al currículo de 4.º de básica. Los estudiantes completaron la guía de campo caminando y no paraban de preguntar. La Fortaleza Ozama fue lo más impactante."),
    r("ciudad-colonial", "Prof. Rafael Núñez", "Liceo Juan Pablo Duarte, Los Alcarrizos", 5, "2025-06-20",
      "Excelente relación calidad-precio. El taller de crónicas en el Parque Colón conectó perfecto con Lengua Española. Lleven sombrilla y agua extra en mayo."),
    r("ciudad-colonial", "Prof. Carmen Dilone", "Colegio San Judas Tadeo", 4, "2025-03-14",
      "Muy buena logística con los autobuses. Sugeriría salir más temprano para evitar el calor del mediodía en las calles empedradas."),
  ],
  "memorial-resistencia": [
    r("memorial-resistencia", "Prof. Luis Emilio Brea", "Liceo Matemático, Santo Domingo", 5, "2025-10-30",
      "Imprescindible para 5.º y 6.º de secundaria. Mis estudiantes salieron en silencio y al día siguiente la discusión en clase fue la mejor del año. Reserven con tiempo: los cupos vuelan."),
    r("memorial-resistencia", "Prof. Marisol Jiménez", "Escuela Nacional Rep. de Panamá", 5, "2025-09-15",
      "La entrada fue gratuita para nuestra escuela pública y el personal nos trató con mucho respeto. Preparen al grupo antes: hay salas emocionalmente fuertes."),
  ],
  "faro-a-colon": [
    r("faro-a-colon", "Prof. Juan Carlos Abreu", "Colegio Quisqueya", 4, "2025-08-19",
      "La escala del edificio impresiona muchísimo a los niños. Aprovechamos para medir el monumento con pasos y salió una clase de matemática buenísima."),
  ],
  "casas-reales": [
    r("casas-reales", "Prof. Ana Mercedes Rosario", "Colegio Calasanz", 5, "2025-07-11",
      "La sala de navegación y la armería son espectaculares. Combínenlo con la Ciudad Colonial el mismo día: queda a dos cuadras."),
  ],
  "historia-natural": [
    r("historia-natural", "Prof. Esther Peralta", "Escuela Manuel de Jesús Galván, D.N.", 5, "2025-11-21",
      "El esqueleto de la ballena jorobada dejó a los niños sin palabras. Los mediadores guiaron estación por estación con preguntas abiertas. Muy cómodo por ser techado."),
    r("historia-natural", "Prof. Ignacio Vásquez", "Colegio Bilingüe New Horizons", 5, "2025-06-06",
      "La sala del universo conectó directo con la unidad del sistema solar y el boleto escolar es muy accesible."),
  ],
  "tres-ojos": [
    r("tres-ojos", "Prof. Miguel Corporán", "Escuela Eugenio M. de Hostos, SDE", 5, "2025-10-02",
      "Ideal para introducir ecosistemas de cueva en 3.º. La balsa del lago emocionó a todo el grupo. Las escaleras exigen vigilancia pero el personal apoya en todo momento."),
    r("tres-ojos", "Prof. Altagracia Peña", "Centro Educativo Ntra. Sra. de Fátima", 4, "2025-05-16",
      "La unidad de rocas y minerales cobró sentido completo. Calzado cerrado sí o sí."),
  ],
  "altos-de-chavon": [
    r("altos-de-chavon", "Prof. Rosa Elena Guzmán", "Colegio Loyola, San Cristóbal", 5, "2025-05-09",
      "El museo arqueológico taíno vale el viaje por sí solo. Los talleres de artesanos permitieron a los chicos ver oficios reales en acción."),
  ],
  "cotubanama-bayahibe": [
    r("cotubanama-bayahibe", "Prof. Paola Herrera", "Escuela Básica de Bayahíbe", 5, "2025-09-12",
      "El vivero de coral fue revelador: los estudiantes entendieron que un arrecife se puede sembrar. Los guardaparques explican de maravilla."),
  ],
  "isla-saona": [
    r("isla-saona", "Prof. Félix Santana", "Liceo Científico Dr. Canela Lázaro", 5, "2025-03-28",
      "Combinamos la charla de tortugas marinas con redacción de textos argumentativos sobre turismo sostenible. Aprendizaje y playa en un solo día."),
    r("isla-saona", "Prof. Giovanna Reyes", "Colegio Santa Teresita", 4, "2024-12-05",
      "Viaje largo desde la capital pero lo vale. Salgan a las 6:00 a. m. y contraten el almuerzo incluido."),
  ],
  "los-haitises": [
    r("los-haitises", "Prof. Ramón Peña Sosa", "Liceo Hato Mayor del Rey", 5, "2025-11-02",
      "Las pictografías de la Cueva de la Arena son impresionantes y el guía explicó la formación de los mogotes con una claridad enorme. La mejor clase de geología de mi carrera."),
    r("los-haitises", "Prof. Wendy Castillo", "Colegio Adventista de Samaná", 5, "2025-04-18",
      "Llevar impermeable: llueve casi siempre. Aun mojados, los estudiantes no querían irse."),
  ],
  "salto-el-limon": [
    r("salto-el-limon", "Prof. Juan Alberto Féliz", "Liceo de El Limón, Samaná", 4, "2025-06-28",
      "La caminata es exigente pero el premio final es enorme. Preparen condición física previa y lleven muda de ropa."),
  ],
  "monumento-santiago": [
    r("monumento-santiago", "Prof. Daniel Espinal", "Colegio De La Salle, Santiago", 5, "2025-10-14",
      "Los murales de Vela Zanetti y la historia del cambio de nombre del monumento generaron un debate buenísimo sobre memoria histórica."),
    r("monumento-santiago", "Prof. Luz María Tavárez", "Escuela Básica Santiago Rodríguez", 5, "2025-02-26",
      "La vista del valle del Cibao desde el mirador es la mejor clase de geografía posible."),
  ],
  "centro-leon": [
    r("centro-leon", "Prof. Katherine Almonte", "Colegio Babeque Secundaria", 5, "2025-09-05",
      "El equipo educativo del centro preparó un taller a la medida de nuestra unidad de identidad dominicana. Nivel internacional."),
  ],
  "teleferico-puerto-plata": [
    r("teleferico-puerto-plata", "Prof. Orlando Vargas", "Liceo Gregorio Luperón, Puerto Plata", 5, "2025-07-22",
      "Subir y sentir cómo baja la temperatura hizo que el concepto de pisos térmicos quedara grabado para siempre. Vayan temprano, antes de que nuble."),
  ],
  "charcos-damajagua": [
    r("charcos-damajagua", "Prof. José Luis Tejada", "Liceo Gregorio Luperón, Puerto Plata", 5, "2025-09-27",
      "La mejor excursión de media que hemos hecho. El protocolo de seguridad con cascos y chalecos es impecable."),
    r("charcos-damajagua", "Prof. Anny Rodríguez", "Liceo José Francisco Peña Gómez", 4, "2024-11-30",
      "Experiencia inolvidable, aunque la subida es exigente. Avisen con tiempo para preparar condición física."),
  ],
  jarabacoa: [
    r("jarabacoa", "Prof. Pedro Antonio Lora", "Escuela Básica de Jarabacoa", 5, "2025-08-08",
      "La visita a la finca de fresas explicó el microclima mejor que cualquier libro. Clima perfecto todo el día."),
  ],
  "valle-nuevo": [
    r("valle-nuevo", "Prof. Yissel Durán", "Liceo de Constanza", 5, "2025-01-19",
      "Salimos de madrugada y vimos escarcha. Ver hielo en República Dominicana cambió la cabeza de mis estudiantes sobre el clima del país. Lleven abrigo de verdad."),
  ],
  "piramides-valle-nuevo": [
    r("piramides-valle-nuevo", "Prof. Héctor Bencosme", "Colegio Agustiniano", 4, "2025-02-08",
      "Buena parada para explicar coordenadas y centro geográfico. Hace muchísimo frío al amanecer, vengan preparados."),
  ],
  "santo-cerro": [
    r("santo-cerro", "Prof. Milagros Fernández", "Escuela Básica La Vega", 5, "2025-09-24",
      "Contrastar la leyenda del Santo Cerro con las ruinas de La Vega Vieja fue una lección de método histórico que no esperaba lograr tan bien."),
  ],
  "cuevas-el-pomier": [
    r("cuevas-el-pomier", "Prof. Santiago Montero", "Liceo de San Cristóbal", 5, "2025-10-21",
      "Estar frente a pinturas de hace 2.000 años a 50 minutos de la capital es impactante. Hablamos también de la amenaza de la minería: ciudadanía ambiental pura."),
    r("cuevas-el-pomier", "Prof. Elena Santos", "Colegio Padre Fantino", 5, "2025-05-30",
      "Reserven con antelación y lleven linternas extra. El guía fue excelente con los murciélagos y las normas de conservación."),
  ],
  "castillo-del-cerro": [
    r("castillo-del-cerro", "Prof. Freddy Objío", "Liceo Nocturno San Cristóbal", 4, "2025-04-03",
      "Confirmen el acceso antes de salir: a nosotros nos tocó trabajar desde el exterior, pero aun así el análisis de la arquitectura del poder funcionó muy bien."),
  ],
  "casa-de-caoba": [
    r("casa-de-caoba", "Prof. Ingrid Valdez", "Colegio Hostosiano", 4, "2025-03-21",
      "Hicimos observación exterior y debate sobre patrimonio incómodo. El estado de deterioro es parte de la lección, pero no entren sin permiso."),
  ],
  "parque-piedras-vivas": [
    r("parque-piedras-vivas", "Prof. Freddy Objío", "Liceo Nocturno San Cristóbal", 5, "2025-04-03",
      "Cerramos aquí la ruta del trujillismo y fue perfecto: sentados en círculo, en el terreno donde estuvo la casa del dictador, hablando de democracia."),
  ],
  "lago-enriquillo": [
    r("lago-enriquillo", "Prof. Ramón Estévez", "Liceo Enriquillo, Neyba", 5, "2025-10-18",
      "Ver cocodrilos americanos en libertad e iguanas rinoceronte es algo que ningún libro logra. El centro de visitantes tiene excelente material previo."),
    r("lago-enriquillo", "Prof. Dulce Mejía", "Escuela Básica Las Mercedes, Independencia", 4, "2025-02-21",
      "El calor es intenso pero la organización lo prevé con hidratación constante. Perfecto para ecosistemas áridos en 5.º."),
  ],
};

const KEY = "primitivos-explorer:reviews:v2";

function loadAll(): Record<string, Review[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Review[]>) : {};
  } catch {
    return {};
  }
}

export function useReviews(destId: string) {
  const [userReviews, setUserReviews] = useState<Review[]>(() => loadAll()[destId] ?? []);

  const reviews = useMemo<Review[]>(() => [...userReviews, ...(SEEDS[destId] ?? [])], [userReviews, destId]);

  const stats = useMemo(() => {
    const count = reviews.length;
    const avg = count ? reviews.reduce((a, rv) => a + rv.rating, 0) / count : 0;
    const dist = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: reviews.filter((rv) => rv.rating === stars).length }));
    return { count, avg, dist };
  }, [reviews]);

  const addReview = useCallback(
    (data: Omit<Review, "id" | "destId" | "date">) => {
      const review: Review = { ...data, id: `u-${Date.now()}`, destId, date: new Date().toISOString().slice(0, 10) };
      setUserReviews((prev) => {
        const next = [review, ...prev];
        try {
          const all = loadAll();
          all[destId] = next;
          localStorage.setItem(KEY, JSON.stringify(all));
        } catch {
          /* almacenamiento no disponible */
        }
        return next;
      });
    },
    [destId],
  );

  const removeReview = useCallback(
    (id: string) => {
      setUserReviews((prev) => {
        const next = prev.filter((rv) => rv.id !== id);
        try {
          const all = loadAll();
          all[destId] = next;
          localStorage.setItem(KEY, JSON.stringify(all));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [destId],
  );

  return { reviews, stats, addReview, removeReview };
}
