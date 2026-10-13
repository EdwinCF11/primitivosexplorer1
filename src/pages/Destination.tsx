import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Bus,
  CalendarClock,
  Clock3,
  GraduationCap,
  Lightbulb,
  MapPin,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ACCESS_META, DESTINATIONS, HOME_BASE, getDestination, subjectLabel } from "../data/destinations";
import { SUBJECT_ICONS } from "../lib/subjects";
import LeafletMap from "../components/LeafletMap";
import TripBuilder from "../components/TripBuilder";
import ReviewSection from "../components/ReviewSection";
import Stars from "../components/Stars";
import { useReviews } from "../hooks/useReviews";
import { formatDOP } from "../lib/trip";

const ease = [0.22, 1, 0.36, 1] as const;

function SectionTitle({ kicker, title }: { kicker: string; title: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease }}
    >
      <p className="pe-kicker mb-3 text-terra">{kicker}</p>
      <h2 className="font-display text-3xl leading-[1.03] font-black md:text-5xl">{title}</h2>
    </motion.div>
  );
}

export default function Destination() {
  const { slug } = useParams();
  const dest = getDestination(slug ?? "");
  const safeId = dest?.id ?? DESTINATIONS[0].id;
  const { stats } = useReviews(safeId);

  const mapPoints = useMemo(
    () =>
      dest
        ? [
            { coords: HOME_BASE.coords, label: HOME_BASE.label, kind: "base" as const },
            { coords: dest.coords, label: `${dest.name} · ${dest.province}` },
          ]
        : [],
    [dest],
  );
  const route = useMemo(() => (dest ? ([HOME_BASE.coords, dest.coords] as [number, number][]) : []), [dest]);

  if (!dest) return <Navigate to="/" replace />;

  const idx = DESTINATIONS.indexOf(dest);
  const next = DESTINATIONS[(idx + 1) % DESTINATIONS.length];
  const acc = ACCESS_META[dest.access];

  return (
    <main className="pt-[72px]">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-ink text-cream">
        <img src={dest.image} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/65 via-ink/25 to-ink/92" />
        <div className="relative mx-auto max-w-7xl px-5 pt-10 pb-10 md:px-8 md:pt-14">
          <Link to="/" className="group inline-flex items-center gap-2 text-sm font-semibold text-cream/80 transition-colors hover:text-sun">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Todos los destinos
          </Link>

          <div className="mt-20 flex flex-wrap items-center gap-2 md:mt-32">
            <span className="pe-sticker bg-terra text-cream">{dest.type}</span>
            <span className="pe-sticker bg-cream/95 text-ink">{dest.province}</span>
            <span className="pe-sticker hidden bg-cream/95 text-ink md:inline-flex">{dest.level}</span>
            <span className={`pe-sticker border-cream/60 ${acc.tone}`}>{acc.label}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="mt-5 max-w-4xl font-display text-[clamp(2.3rem,6.5vw,5rem)] leading-[0.95] font-black tracking-tight"
          >
            {dest.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease }}
            className="mt-4 max-w-xl text-base text-cream/80 md:text-lg"
          >
            {dest.tagline}
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-cream/20 pt-5 text-sm">
            <span className="flex items-center gap-2">
              <Stars value={stats.avg} />
              <b>{stats.avg.toFixed(1)}</b>
              <span className="text-cream/60">({stats.count})</span>
            </span>
            <span className="flex items-center gap-2 text-cream/80">
              <Clock3 className="h-4 w-4 text-ember" /> {dest.duration}
            </span>
            <span className="flex items-center gap-2 text-cream/80">
              <MapPin className="h-4 w-4 text-ember" /> {dest.distanceKm} km · {dest.travelTime}
            </span>
          </div>
        </div>
      </section>

      {/* ============ AVISO DE ACCESO ============ */}
      {dest.access !== "libre" && (
        <div className={`border-b-2 border-ink ${dest.access === "restringido" ? "bg-terra text-cream" : "bg-sun"}`}>
          <div className="mx-auto flex max-w-7xl items-start gap-3 px-5 py-4 md:px-8">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm leading-relaxed">
              <b className="tracking-wide uppercase">{acc.label}.</b> {dest.accessNote}
            </p>
          </div>
        </div>
      )}

      {/* ============ SOBRE + FICHA ============ */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionTitle kicker="La lección detrás del lugar" title={<>Sobre <span className="pe-outline-ink italic">este destino</span></>} />
            <div className="mt-6 space-y-5 text-[0.98rem] leading-relaxed text-ink/75">
              {dest.description.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease }}
                  className={i === 0 ? "text-lg text-ink/85 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-black first-letter:text-terra" : ""}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* DATOS CURIOSOS */}
            <div className="mt-12">
              <SectionTitle kicker="Para enganchar al grupo" title={<>Datos <span className="text-terra italic">curiosos</span></>} />
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {dest.curiosities.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease }}
                    className={`flex gap-3 rounded-[1.2rem] border-2 border-ink p-4 pe-shadow-soft ${i % 2 ? "bg-parchment/60" : "bg-cream"}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-ink bg-sun">
                      <Lightbulb className="h-4.5 w-4.5" />
                    </span>
                    <p className="text-sm leading-relaxed text-ink/80">{c}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CURRÍCULO */}
            <div className="mt-12">
              <SectionTitle kicker="Relación curricular" title={<>Lo que el grupo <span className="text-terra italic">aprenderá</span></>} />
              <div className="mt-7 space-y-5">
                {dest.curricular.map((c, i) => {
                  const Icon = SUBJECT_ICONS[c.subject];
                  return (
                    <motion.div
                      key={c.subject + i}
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: i * 0.07, ease }}
                      className="rounded-[1.4rem] border-2 border-ink bg-cream p-6 pe-shadow-soft"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-sun">
                          <Icon className="h-5.5 w-5.5" />
                        </span>
                        <div>
                          <p className="pe-kicker text-[0.6rem] text-terra">{subjectLabel(c.subject)}</p>
                          <h3 className="font-display text-xl leading-tight font-black">{c.title}</h3>
                        </div>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {c.points.map((p) => (
                          <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-ink/75">
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-terra" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FICHA TÉCNICA */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="rounded-[1.5rem] border-2 border-ink bg-cream p-6 pe-shadow"
              >
                <p className="pe-kicker mb-4 flex items-center gap-2 text-ink/50">
                  <GraduationCap className="h-4 w-4 text-terra" /> Ficha técnica
                </p>
                <dl className="space-y-4 text-sm">
                  {[
                    { icon: GraduationCap, k: "Nivel recomendado", v: `${dest.level} · ${dest.grades}` },
                    { icon: Clock3, k: "Duración", v: dest.duration },
                    { icon: Bus, k: "Traslado", v: `${dest.distanceKm} km · ${dest.travelTime}` },
                    { icon: CalendarClock, k: "Mejor temporada", v: dest.bestSeason },
                    { icon: BookOpen, k: "Asignaturas", v: dest.subjects.map(subjectLabel).join(", ") },
                    { icon: MapPin, k: "Coordenadas", v: `${dest.coords[0].toFixed(4)}, ${dest.coords[1].toFixed(4)}` },
                  ].map((f) => (
                    <div key={f.k} className="flex gap-3 border-b border-dashed border-ink/20 pb-3 last:border-0">
                      <f.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-terra" />
                      <div className="min-w-0">
                        <dt className="text-[0.62rem] font-bold tracking-[0.18em] text-ink/45 uppercase">{f.k}</dt>
                        <dd className="mt-0.5 font-semibold">{f.v}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 rounded-xl bg-pine p-4 text-cream">
                  <p className="text-[0.62rem] font-bold tracking-[0.22em] text-sand uppercase">Entrada + guía desde</p>
                  <p className="font-display text-2xl font-black">
                    {formatDOP(dest.pricePerStudent)}
                    <span className="ml-1 font-sans text-xs font-medium text-cream/60">/estudiante</span>
                  </p>
                </div>
                <a
                  href="#cotizador"
                  className="group mt-4 flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-terra px-4 py-3.5 font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-ink pe-shadow-sm"
                >
                  Calcular presupuesto
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </div>
          </aside>
        </div>
      </section>

      {/* ============ MAPA + GALERÍA ============ */}
      <section className="border-y-2 border-ink bg-parchment/50">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionTitle kicker="Ubicación geográfica" title={<>Ubicación y <span className="pe-outline-ink italic">ruta escolar</span></>} />
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="mt-7 overflow-hidden rounded-[1.5rem] border-2 border-ink pe-shadow"
              >
                <LeafletMap points={mapPoints} route={route} className="h-[380px] md:h-[470px]" fitPadding={60} />
              </motion.div>
              <p className="mt-4 flex items-start gap-2 text-sm text-ink/60">
                <RouteIcon className="mt-0.5 h-4 w-4 shrink-0 text-terra" />
                Ruta referencial desde el Gran Santo Domingo: {dest.distanceKm} km · {dest.travelTime}. Haz clic en el
                mapa para activar el zoom con la rueda.
              </p>
            </div>

            <div className="lg:col-span-5">
              <SectionTitle kicker="Bitácora visual" title={<>Galería <span className="text-terra italic">de campo</span></>} />
              <div className="mt-7 space-y-4">
                {dest.gallery.slice(0, 3).map((g, i) => (
                  <motion.figure
                    key={g}
                    initial={{ opacity: 0, y: 28, rotate: i % 2 ? 3 : -3 }}
                    whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 2 : -2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease }}
                    className="rounded-[1.2rem] border-2 border-ink bg-cream p-2.5 pe-shadow-sm"
                  >
                    <img src={g} alt={`Registro de campo ${i + 1} · ${dest.name}`} className="aspect-[16/10] w-full rounded-[0.8rem] object-cover" loading="lazy" />
                    <figcaption className="px-1.5 pt-2 pb-1 text-xs font-bold tracking-[0.18em] text-ink/55 uppercase">
                      Registro {String(i + 1).padStart(2, "0")} · {dest.region}
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ITINERARIO ============ */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <SectionTitle kicker="Momento a momento" title={<>Itinerario <span className="pe-outline-ink italic">del día</span></>} />
        <div className="mt-10 grid gap-x-14 md:grid-cols-2">
          {dest.itinerary.map((s, i) => (
            <motion.div
              key={s.time + i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.06, ease }}
              className="flex gap-5 border-b border-dashed border-ink/25 py-5"
            >
              <span className="mt-0.5 shrink-0 rounded-full border-2 border-ink bg-sun px-3 py-1 font-display text-sm leading-none font-black whitespace-nowrap">
                {s.time}
              </span>
              <div>
                <h3 className="font-display text-lg leading-tight font-black">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ SEGURIDAD ============ */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease }}
          className="overflow-hidden rounded-[2rem] border-2 border-ink bg-pine text-cream pe-shadow"
        >
          <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="pe-kicker mb-3 text-ember">Protocolo certificado</p>
              <h2 className="font-display text-3xl leading-[1.03] font-black md:text-5xl">
                Seguridad <span className="text-sun italic">primero</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-cream/70">
                Cada salida sigue un protocolo revisado con los administradores del sitio, el equipo de transporte y la
                coordinación docente.
              </p>
              <div className="mt-6 inline-flex rotate-[-2deg] items-center gap-2 rounded-full border-2 border-sun bg-terra px-5 py-2.5 text-sm font-bold">
                <ShieldCheck className="h-5 w-5" /> 1 adulto / 8 estudiantes
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {dest.safety.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease }}
                  className="flex items-start gap-3 rounded-xl border border-cream/15 bg-cream/5 p-4 text-sm leading-relaxed text-cream/85"
                >
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
                  {s}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ============ COTIZADOR ============ */}
      <section id="cotizador" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-16 md:px-8">
        <SectionTitle kicker="Sin salir de esta ficha" title={<>Calcula tu <span className="text-terra italic">presupuesto</span></>} />
        <p className="mt-3 max-w-xl text-sm text-ink/60">
          Añade o elimina destinos y servicios: el total y el costo por estudiante se actualizan al instante.
        </p>
        <div className="mt-8">
          <TripBuilder key={dest.id} initialDestIds={[dest.id]} />
        </div>
      </section>

      {/* ============ RESEÑAS ============ */}
      <section className="border-t-2 border-ink bg-parchment/50">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <SectionTitle kicker="Voces del aula" title={<>Reseñas <span className="pe-outline-ink italic">de docentes</span></>} />
          <div className="mt-10">
            <ReviewSection key={dest.id} destId={dest.id} destName={dest.name} />
          </div>
        </div>
      </section>

      {/* ============ SIGUIENTE ============ */}
      <Link to={`/destino/${next.slug}`} className="group relative block overflow-hidden border-t-2 border-ink bg-ink py-14 text-cream md:py-20">
        <img src={next.image} alt={next.name} className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-700 group-hover:scale-105" />
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
          <div>
            <p className="pe-kicker mb-3 text-ember">Siguiente expedición</p>
            <p className="font-display text-3xl leading-[1] font-black md:text-5xl">{next.name}</p>
            <p className="mt-2 text-sm text-cream/65">
              {next.province} · {next.type}
            </p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-cream transition-transform duration-300 group-hover:rotate-45 md:h-20 md:w-20">
            <ArrowRight className="h-6 w-6 md:h-8 md:w-8" />
          </span>
        </div>
      </Link>
    </main>
  );
}
