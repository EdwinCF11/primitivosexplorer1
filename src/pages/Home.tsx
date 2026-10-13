import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, BookOpen, Calculator, Compass, FileDown, MapPin, Search } from "lucide-react";
import { DESTINATIONS, HOME_BASE, PROVINCES, STOCK, SUBJECTS, type SubjectId } from "../data/destinations";
import { SUBJECT_BLURB, SUBJECT_ICONS } from "../lib/subjects";
import DestinationCard from "../components/DestinationCard";
import FilterBar, { EMPTY_FILTERS, type Filters } from "../components/FilterBar";
import LeafletMap from "../components/LeafletMap";
import Marquee from "../components/Marquee";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Home() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [visible, setVisible] = useState(9);
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#destinos") {
      setTimeout(() => document.getElementById("destinos")?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [location.hash]);

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return DESTINATIONS.filter((d) => {
      if (filters.province && d.province !== filters.province) return false;
      if (filters.subject && !d.subjects.includes(filters.subject as SubjectId)) return false;
      if (filters.type && d.type !== filters.type) return false;
      if (filters.level && !d.level.toLowerCase().includes(filters.level.toLowerCase())) return false;
      if (q) {
        const hay =
          `${d.name} ${d.tagline} ${d.province} ${d.region} ${d.type} ${d.description.join(" ")} ${d.curiosities.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filters]);

  useEffect(() => setVisible(9), [filters]);

  const scrollToDestinos = () => document.getElementById("destinos")?.scrollIntoView({ behavior: "smooth" });

  const mapPoints = useMemo(
    () => [
      { coords: HOME_BASE.coords, label: HOME_BASE.label, kind: "base" as const },
      ...DESTINATIONS.map((d) => ({
        coords: d.coords,
        label: `${d.name} · ${d.province}`,
        href: `/destino/${d.slug}`,
      })),
    ],
    [],
  );

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink text-cream">
        <img src="/images/hero.jpg" alt="Cordillera y costa de la República Dominicana al amanecer" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/25 to-ink/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 to-transparent" />

        <div className="pointer-events-none absolute top-28 right-6 hidden rotate-6 lg:block lg:right-16">
          <div className="pe-float rounded-full border-2 border-cream/80 bg-terra/90 px-6 py-3 text-center pe-shadow-sm">
            <p className="font-display text-lg leading-none font-black">{DESTINATIONS.length} destinos</p>
            <p className="mt-1 text-[0.58rem] font-bold tracking-[0.3em] uppercase">del aula al territorio</p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-36 pb-10 md:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="pe-kicker mb-5 flex items-center gap-2 text-sand"
          >
            <Compass className="h-4 w-4 text-ember" /> Excursiones escolares · República Dominicana
          </motion.p>

          <h1 className="font-display leading-[0.92] font-black tracking-tight">
            {["EXPLORA.", "APRENDE.", "DESCUBRE."].map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
                className={`block text-[clamp(3.2rem,10vw,8rem)] ${
                  i === 1 ? "pe-outline-cream" : i === 2 ? "text-ember italic" : ""
                }`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg"
          >
            Parques, museos, cuevas y monumentos de todo el país convertidos en aulas vivas. Filtra por provincia o
            asignatura, arma la ruta, calcula el costo por estudiante y descarga la guía pedagógica.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={scrollToDestinos}
              className="group inline-flex items-center gap-3 rounded-full border-2 border-ink bg-cream px-7 py-4 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-sun pe-shadow-sm"
            >
              Explorar destinos
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </button>
            <Link
              to="/calculadora"
              className="group inline-flex items-center gap-3 rounded-full border-2 border-cream/40 bg-ink/30 px-7 py-4 font-semibold text-cream backdrop-blur-sm transition-all hover:border-cream hover:bg-terra"
            >
              Armar mi viaje
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-12 grid grid-cols-2 gap-6 border-t border-cream/20 pt-6 md:grid-cols-4"
          >
            {[
              [String(DESTINATIONS.length), "destinos curriculares"],
              [String(PROVINCES.length), "provincias recorridas"],
              [String(SUBJECTS.length), "asignaturas conectadas"],
              ["350+", "docentes ya viajaron"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-3xl font-black text-ember md:text-4xl">{n}</p>
                <p className="mt-1 text-xs tracking-[0.18em] text-cream/65 uppercase">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Marquee
        items={["Matemática", "Ciencias Naturales", "Ciencias Sociales", "Lengua Española", "Educación Artística", "Guías pedagógicas", "Seguridad certificada"]}
        className="border-y-2 border-ink bg-terra text-cream"
        duration="36s"
      />

      {/* ================= BUSCADOR + DESTINOS ================= */}
      <section id="destinos" className="mx-auto max-w-7xl scroll-mt-24 px-5 pt-16 pb-8 md:px-8 md:pt-20">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="pe-kicker mb-3 flex items-center gap-2 text-terra">
              <MapPin className="h-4 w-4" /> Catálogo de expediciones
            </p>
            <h2 className="font-display text-4xl leading-[1] font-black md:text-6xl">
              Todos los <span className="pe-outline-ink italic">destinos</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/60">
            Cada ficha incluye relación curricular, datos curiosos, nivel recomendado, ubicación real, medidas de
            seguridad y guía descargable.
          </p>
        </div>

        <FilterBar value={filters} onChange={setFilters} onSearch={scrollToDestinos} results={results.length} />

        {results.length === 0 ? (
          <div className="mt-10 rounded-[1.6rem] border-2 border-dashed border-ink/30 bg-cream/60 p-12 text-center">
            <p className="font-display text-2xl font-black">Ningún destino coincide con esa brújula</p>
            <p className="mt-2 text-sm text-ink/60">Ajusta los filtros o limpia la búsqueda para ver todo el catálogo.</p>
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="mt-5 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 pe-shadow-sm"
            >
              Ver los {DESTINATIONS.length} destinos
            </button>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.slice(0, visible).map((d) => (
                <DestinationCard key={d.id} dest={d} index={DESTINATIONS.indexOf(d)} className="h-full" />
              ))}
            </div>
            {visible < results.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisible((v) => v + 9)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-8 py-4 font-semibold transition-all hover:-translate-y-0.5 hover:bg-sun pe-shadow-sm"
                >
                  Ver más destinos ({results.length - visible} restantes)
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ================= MAPA GENERAL ================= */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-pine text-cream pe-shadow">
          <div className="grid lg:grid-cols-12">
            <div className="flex flex-col gap-6 p-7 md:p-10 lg:col-span-4">
              <div>
                <p className="pe-kicker mb-3 text-ember">Cartografía del programa</p>
                <h2 className="font-display text-3xl leading-[1.05] font-black md:text-5xl">
                  El mapa de
                  <br />
                  <span className="text-sun italic">la expedición</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-cream/70">
                  Las {DESTINATIONS.length} ubicaciones están georreferenciadas sobre su posición real. Toca un
                  marcador para abrir la ficha del destino.
                </p>
              </div>
              <ul className="pe-scrollbar max-h-[340px] space-y-2 overflow-y-auto pr-2">
                {DESTINATIONS.map((d) => (
                  <li key={d.id}>
                    <Link
                      to={`/destino/${d.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-cream/15 bg-cream/5 px-4 py-2.5 text-sm transition-colors hover:border-ember hover:bg-cream/10"
                    >
                      <span className="min-w-0 flex-1 truncate font-semibold">{d.name}</span>
                      <span className="flex shrink-0 items-center gap-2 text-xs text-cream/55">
                        {d.distanceKm} km
                        <ArrowUpRight className="h-4 w-4 text-ember transition-transform group-hover:rotate-45" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative lg:col-span-8">
              <LeafletMap points={mapPoints} className="h-[460px] lg:h-full lg:min-h-[620px]" fitPadding={44} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CÓMO FUNCIONA ================= */}
      <section className="border-y-2 border-ink bg-parchment/50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, rotate: -9, y: 30 }}
              whileInView={{ opacity: 1, rotate: -4, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="rounded-[1.4rem] border-2 border-ink bg-cream p-3 pe-shadow"
            >
              <img src={STOCK.busTrip} alt="Estudiantes abordando el autobús escolar" className="aspect-[4/3] w-full rounded-[0.9rem] object-cover" loading="lazy" />
              <p className="px-2 py-3 text-center font-display text-lg font-bold italic">Bitácora n.º 01 — El gran día</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: 8, y: 40 }}
              whileInView={{ opacity: 1, rotate: 3, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="absolute -right-4 -bottom-10 hidden w-56 rounded-[1.2rem] border-2 border-ink bg-cream p-2.5 pe-shadow-sm sm:block"
            >
              <img src={STOCK.outdoorLesson} alt="Lección al aire libre" className="aspect-[4/3] w-full rounded-[0.7rem] object-cover" loading="lazy" />
              <p className="px-1 pt-2 pb-1 text-center text-xs font-bold tracking-widest uppercase">Clase sin techo</p>
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="pe-kicker mb-3 flex items-center gap-2 text-terra">
              <Compass className="h-4 w-4" /> Metodología Primitivos
            </p>
            <h2 className="font-display text-4xl leading-[1.02] font-black md:text-5xl">
              Organizar la excursión,
              <br />
              <span className="text-terra italic">resuelto en 3 pasos</span>
            </h2>
            <div className="mt-8 space-y-4">
              {[
                { icon: Search, n: "01", t: "Busca y filtra", d: "Encuentra el destino ideal por provincia, asignatura, tipo o nivel. Cada ficha trae su relación curricular y datos curiosos." },
                { icon: Calculator, n: "02", t: "Arma la ruta y calcula", d: "Añade uno o varios destinos, indica cuántos alumnos van y elimina lo que no necesites: el presupuesto se recalcula al instante." },
                { icon: FileDown, n: "03", t: "Descarga la guía", d: "Genera el PDF con objetivos, actividades antes/durante/después, vocabulario, itinerario, seguridad y presupuesto." },
              ].map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease }}
                  className="flex gap-4 rounded-2xl border-2 border-ink bg-cream p-5 pe-shadow-soft"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-sun">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="flex items-baseline gap-2 font-display text-xl font-black">
                      <span className="text-sm text-terra">{s.n}</span> {s.t}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink/65">{s.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CURRÍCULO ================= */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="pe-kicker mb-3 flex items-center gap-2 text-terra">
              <BookOpen className="h-4 w-4" /> Relación curricular
            </p>
            <h2 className="font-display text-4xl leading-[1] font-black md:text-6xl">
              El territorio <span className="pe-outline-ink italic">enseña</span>
            </h2>
          </div>
          <Link to="/calculadora" className="group inline-flex w-fit items-center gap-2 font-semibold text-terra">
            Armá tu expedición
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {SUBJECTS.map((s, i) => {
            const Icon = SUBJECT_ICONS[s.id];
            const examples = DESTINATIONS.filter((d) => d.subjects.includes(s.id));
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                className={`flex flex-col rounded-[1.4rem] border-2 border-ink p-5 pe-shadow-soft ${i % 2 ? "bg-parchment/70" : "bg-cream"}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-ink bg-terra text-cream">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="mt-3.5 font-display text-xl leading-tight font-black">{s.label}</h3>
                <p className="mt-2 text-xs leading-relaxed text-ink/65">{SUBJECT_BLURB[s.id]}</p>
                <p className="mt-3 text-[0.65rem] font-bold tracking-[0.18em] text-terra uppercase">
                  {examples.length} destinos
                </p>
                <div className="mt-2 flex flex-col gap-1 border-t border-dashed border-ink/25 pt-2.5">
                  {examples.slice(0, 3).map((e) => (
                    <Link key={e.id} to={`/destino/${e.slug}`} className="truncate text-xs font-semibold text-pine underline-offset-2 hover:text-terra hover:underline">
                      → {e.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ================= CTA FINAL ================= */}
      <section className="border-t-2 border-ink bg-sun">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="pe-kicker mb-2 text-ink/60">¿Docente? ¿Coordinador de viajes?</p>
            <h2 className="font-display text-3xl leading-[1.05] font-black md:text-5xl">
              Cotiza tu próxima
              <br />
              excursión en 60 segundos
            </h2>
          </div>
          <Link
            to="/calculadora"
            className="group inline-flex items-center gap-3 rounded-full border-2 border-ink bg-ink px-8 py-5 font-semibold text-cream transition-all hover:-translate-y-1 hover:bg-terra pe-shadow"
          >
            Abrir la calculadora
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </section>
    </main>
  );
}
