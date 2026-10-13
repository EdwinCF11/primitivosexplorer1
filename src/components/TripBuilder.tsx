import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bus,
  Camera,
  Check,
  CrossIcon,
  Download,
  FileText,
  Info,
  MapPin,
  Notebook,
  Plus,
  RotateCcw,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { ACCESS_META, DESTINATIONS } from "../data/destinations";
import { computeTrip, EXTRAS, formatDOP, type TripState } from "../lib/trip";
import { downloadGuide, downloadItinerary } from "../lib/guide";

const EXTRA_ICONS: Record<string, typeof Bus> = {
  utensils: UtensilsCrossed,
  shield: ShieldCheck,
  notebook: Notebook,
  camera: Camera,
  cross: CrossIcon,
};

interface Props {
  initialDestIds: string[];
  allowMultiple?: boolean;
  showDownloads?: boolean;
  compact?: boolean;
}

export default function TripBuilder({ initialDestIds, allowMultiple = true, showDownloads = true, compact = false }: Props) {
  const [state, setState] = useState<TripState>({
    destIds: initialDestIds,
    students: 35,
    extraIds: ["almuerzo", "seguro"],
    ownTransport: false,
  });
  const [adding, setAdding] = useState(false);

  const trip = useMemo(() => computeTrip(state, DESTINATIONS), [state]);

  const removeLine = useCallback((kind: string, refId: string) => {
    setState((s) => {
      if (kind === "entrada") return { ...s, destIds: s.destIds.filter((id) => id !== refId) };
      if (kind === "transporte") return { ...s, ownTransport: true };
      return { ...s, extraIds: s.extraIds.filter((id) => id !== refId) };
    });
  }, []);

  const toggleExtra = (id: string) =>
    setState((s) => ({
      ...s,
      extraIds: s.extraIds.includes(id) ? s.extraIds.filter((e) => e !== id) : [...s.extraIds, id],
    }));

  const addDest = (id: string) => {
    setState((s) => (s.destIds.includes(id) ? s : { ...s, destIds: [...s.destIds, id] }));
    setAdding(false);
  };

  const reset = () =>
    setState({ destIds: initialDestIds, students: 35, extraIds: ["almuerzo", "seguro"], ownTransport: false });

  const available = DESTINATIONS.filter((d) => !state.destIds.includes(d.id));
  const fill = Math.min(100, Math.max(2, (state.students / 250) * 100));
  const warnings = trip.dests.filter((d) => d.access !== "libre");

  return (
    <div className={`grid items-start gap-6 ${compact ? "" : "lg:grid-cols-12"}`}>
      {/* ───────────── CONFIGURADOR ───────────── */}
      <div className={`space-y-5 ${compact ? "" : "lg:col-span-7"}`}>
        {/* destinos */}
        <div className="rounded-[1.5rem] border-2 border-ink bg-cream p-5 pe-shadow-soft md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-display text-xl font-black">
              <MapPin className="h-5 w-5 text-terra" /> Destinos del viaje
            </p>
            <span className="rounded-full border border-ink/25 px-2.5 py-0.5 text-xs font-bold">
              {trip.dests.length}
            </span>
          </div>

          <div className="space-y-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {trip.dests.map((d, i) => (
                <motion.div
                  key={d.id}
                  layout
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-center gap-3 overflow-hidden rounded-xl border-2 border-ink/20 bg-parchment/40 p-2.5 transition-colors hover:border-ink/50"
                >
                  <img src={d.image} alt={d.name} className="h-14 w-20 shrink-0 rounded-lg border border-ink/20 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      <span className="mr-1.5 text-terra">{String(i + 1).padStart(2, "0")}</span>
                      {d.name}
                    </p>
                    <p className="truncate text-xs text-ink/55">
                      {d.province} · {d.distanceKm} km · {formatDOP(d.pricePerStudent)}/estud.
                    </p>
                  </div>
                  <button
                    onClick={() => removeLine("entrada", d.id)}
                    aria-label={`Eliminar ${d.name}`}
                    title="Eliminar destino"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink/25 text-ink/50 transition-all hover:border-terra hover:bg-terra hover:text-cream"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {trip.dests.length === 0 && (
              <p className="rounded-xl border-2 border-dashed border-ink/25 p-5 text-center text-sm text-ink/55">
                No hay destinos en el viaje. Añade al menos uno para calcular el presupuesto.
              </p>
            )}
          </div>

          {allowMultiple && (
            <div className="mt-3">
              {adding ? (
                <div className="rounded-xl border-2 border-ink bg-parchment/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold tracking-[0.2em] text-ink/55 uppercase">Añadir destino</span>
                    <button onClick={() => setAdding(false)} aria-label="Cerrar">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="pe-scrollbar max-h-56 space-y-1.5 overflow-y-auto pr-1">
                    {available.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => addDest(d.id)}
                        className="flex w-full items-center gap-2 rounded-lg border border-ink/15 bg-cream px-3 py-2 text-left text-sm transition-colors hover:border-terra hover:bg-sun/40"
                      >
                        <Plus className="h-4 w-4 shrink-0 text-terra" />
                        <span className="min-w-0 flex-1 truncate font-semibold">{d.name}</span>
                        <span className="shrink-0 text-xs text-ink/50">{d.province}</span>
                      </button>
                    ))}
                    {!available.length && <p className="p-3 text-center text-xs text-ink/50">Ya añadiste todos los destinos.</p>}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/35 py-3 text-sm font-semibold text-ink/65 transition-all hover:border-terra hover:bg-sun/25 hover:text-ink"
                >
                  <Plus className="h-4 w-4" /> Añadir otro destino a la ruta
                </button>
              )}
            </div>
          )}
        </div>

        {/* estudiantes */}
        <div className="rounded-[1.5rem] border-2 border-ink bg-cream p-5 pe-shadow-soft md:p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.2em] text-ink/55 uppercase">
              <Users className="h-3.5 w-3.5" /> Número de estudiantes
            </span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={state.students}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                className="font-display text-3xl font-black text-terra"
              >
                {state.students}
              </motion.span>
            </AnimatePresence>
          </div>
          <input
            type="range"
            min={10}
            max={250}
            value={state.students}
            onChange={(e) => setState((s) => ({ ...s, students: Number(e.target.value) }))}
            className="pe-range"
            style={{ "--fill": `${fill}%` } as React.CSSProperties}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-ink/45">
            <span>10</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setState((s) => ({ ...s, students: Math.max(1, s.students - 1) }))}
                className="h-7 w-7 rounded-md border border-ink/30 font-bold hover:bg-parchment"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={500}
                value={state.students}
                onChange={(e) => setState((s) => ({ ...s, students: Math.min(500, Math.max(1, Number(e.target.value) || 1)) }))}
                className="w-20 rounded-lg border border-ink/30 bg-cream px-2 py-1 text-center font-bold text-ink"
              />
              <button
                onClick={() => setState((s) => ({ ...s, students: Math.min(500, s.students + 1) }))}
                className="h-7 w-7 rounded-md border border-ink/30 font-bold hover:bg-parchment"
              >
                +
              </button>
            </div>
            <span>250</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-dashed border-ink/20 pt-3 text-center">
            {[
              ["Docentes gratis", trip.teachers],
              ["Total de plazas", trip.seats],
              ["Autobuses", trip.buses],
            ].map(([k, v]) => (
              <div key={k as string}>
                <p className="font-display text-xl font-black text-pine">{v as number}</p>
                <p className="text-[0.6rem] font-bold tracking-wider text-ink/50 uppercase">{k as string}</p>
              </div>
            ))}
          </div>
        </div>

        {/* servicios */}
        <div className="rounded-[1.5rem] border-2 border-ink bg-cream p-5 pe-shadow-soft md:p-6">
          <p className="mb-4 font-display text-xl font-black">Servicios incluidos</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {EXTRAS.map((ex) => {
              const Icon = EXTRA_ICONS[ex.icon] ?? ShieldCheck;
              const on = state.extraIds.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  onClick={() => toggleExtra(ex.id)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                    on ? "border-ink bg-parchment/70 pe-shadow-sm" : "border-ink/20 bg-cream hover:border-ink/45"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink ${
                      on ? "bg-terra text-cream" : "bg-cream text-transparent"
                    }`}
                  >
                    <Check className="h-4 w-4" strokeWidth={3.4} />
                  </span>
                  <Icon className="h-5 w-5 shrink-0 text-pine" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{ex.label}</span>
                    <span className="block truncate text-xs text-ink/55">{ex.detail}</span>
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => setState((s) => ({ ...s, ownTransport: !s.ownTransport }))}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                !state.ownTransport ? "border-ink bg-parchment/70 pe-shadow-sm" : "border-ink/20 bg-cream hover:border-ink/45"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-ink ${
                  !state.ownTransport ? "bg-terra text-cream" : "bg-cream text-transparent"
                }`}
              >
                <Check className="h-4 w-4" strokeWidth={3.4} />
              </span>
              <Bus className="h-5 w-5 shrink-0 text-pine" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">Transporte Primitivos</span>
                <span className="block truncate text-xs text-ink/55">
                  {state.ownTransport ? "El centro aporta su transporte" : "Autobuses con chofer, ida y vuelta"}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* avisos de acceso */}
        {warnings.length > 0 && (
          <div className="rounded-[1.5rem] border-2 border-ink bg-sun/40 p-5">
            <p className="mb-3 flex items-center gap-2 font-display text-lg font-black">
              <AlertTriangle className="h-5 w-5 text-terra" /> Gestiones previas obligatorias
            </p>
            <ul className="space-y-2.5">
              {warnings.map((d) => (
                <li key={d.id} className="text-sm leading-relaxed">
                  <span className={`pe-chip mr-2 border-ink/40 ${ACCESS_META[d.access].tone}`}>
                    {ACCESS_META[d.access].label}
                  </span>
                  <b>{d.name}:</b> <span className="text-ink/70">{d.accessNote}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ───────────── TICKET ───────────── */}
      <div className={compact ? "" : "lg:col-span-5"}>
        <div className="lg:sticky lg:top-24">
          <div className="pe-ticket rounded-[1.4rem] border-2 border-ink bg-cream p-6 pe-shadow md:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-display text-xl font-black">
                  <Ticket className="h-5 w-5 text-terra" /> PRESUPUESTO
                </p>
                <p className="mt-0.5 text-xs text-ink/55">
                  {trip.dests.length} destino(s) · {trip.students} estudiantes
                </p>
              </div>
              <button
                onClick={reset}
                title="Restablecer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink/25 text-ink/55 transition-colors hover:border-ink hover:text-ink"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="pe-dash my-5" />

            <div className="space-y-3">
              <AnimatePresence initial={false} mode="popLayout">
                {trip.lines.map((l) => (
                  <motion.div
                    key={l.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="group overflow-hidden text-sm"
                  >
                    <div className="flex items-baseline gap-1">
                      <span className="font-semibold">{l.label}</span>
                      <span className="pe-leader" />
                      <span className="font-display font-black whitespace-nowrap">{formatDOP(l.amount)}</span>
                      {l.removable && (
                        <button
                          onClick={() => removeLine(l.kind, l.refId)}
                          aria-label={`Eliminar ${l.label}`}
                          title="Eliminar de la cotización"
                          className="ml-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink/30 transition-colors hover:bg-terra hover:text-cream"
                        >
                          <X className="h-3.5 w-3.5" strokeWidth={3} />
                        </button>
                      )}
                    </div>
                    <p className="mt-0.5 pr-8 text-xs text-ink/50">{l.detail}</p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!trip.lines.length && (
                <p className="py-4 text-center text-sm text-ink/50">
                  La cotización está vacía. Añade destinos o servicios.
                </p>
              )}
            </div>

            <div className="pe-dash my-5" />

            <div className="space-y-1 text-xs text-ink/60">
              <div className="flex justify-between">
                <span>Entradas y guías</span>
                <span className="font-semibold">{formatDOP(trip.subtotalEntradas)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transporte</span>
                <span className="font-semibold">{formatDOP(trip.subtotalTransporte)}</span>
              </div>
              <div className="flex justify-between">
                <span>Servicios adicionales</span>
                <span className="font-semibold">{formatDOP(trip.subtotalExtras)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-t-2 border-ink pt-3">
              <span className="text-sm font-bold tracking-wider uppercase">Total</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={trip.total}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-display text-2xl font-black"
                >
                  {formatDOP(trip.total)}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="mt-4 rounded-xl bg-pine p-4 text-cream">
              <p className="text-[0.62rem] font-bold tracking-[0.25em] text-sand uppercase">Costo por estudiante</p>
              <div className="flex items-end justify-between gap-2">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={trip.perStudentRounded}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="font-display text-4xl leading-none font-black"
                  >
                    {formatDOP(trip.perStudentRounded)}
                  </motion.span>
                </AnimatePresence>
                <span className="flex items-center gap-1.5 text-xs text-cream/70">
                  <Bus className="h-4 w-4" /> {trip.buses} bus · ~{trip.totalKm} km
                </span>
              </div>
            </div>

            <p className="mt-3 flex gap-2 text-[0.7rem] leading-relaxed text-ink/50">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terra" />
              Cortesía de 1 docente por cada 10 estudiantes ya aplicada. Precios referenciales en RD$ sujetos a
              confirmación.
            </p>
          </div>

          {showDownloads && (
            <div className="mt-5 space-y-3">
              <button
                onClick={() => downloadItinerary(trip)}
                disabled={!trip.dests.length}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-terra px-4 py-4 font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 pe-shadow-sm"
              >
                <Download className="h-5 w-5" /> Descargar itinerario (PDF)
              </button>
              <div className="grid gap-2">
                {trip.dests.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => downloadGuide(d, trip)}
                    className="flex items-center justify-between gap-2 rounded-xl border-2 border-ink bg-cream px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:bg-sun pe-shadow-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-terra" />
                      <span className="truncate">Guía pedagógica · {d.name}</span>
                    </span>
                    <Download className="h-4 w-4 shrink-0" />
                  </button>
                ))}
              </div>
              {!trip.dests.length && (
                <Link
                  to="/#destinos"
                  className="block rounded-xl border-2 border-dashed border-ink/30 px-4 py-3 text-center text-sm font-semibold text-ink/60 hover:border-terra hover:text-ink"
                >
                  Explorar el catálogo de destinos
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
