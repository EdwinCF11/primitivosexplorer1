import { BookOpenText, MapPin, Search, Shapes, SlidersHorizontal, X } from "lucide-react";
import { EXCURSION_TYPES, PROVINCES, SUBJECTS } from "../data/destinations";

export interface Filters {
  q: string;
  province: string;
  subject: string;
  type: string;
  level: string;
}

export const EMPTY_FILTERS: Filters = { q: "", province: "", subject: "", type: "", level: "" };

export const LEVELS = ["Primaria", "Secundaria"];

interface Props {
  value: Filters;
  onChange: (f: Filters) => void;
  onSearch: () => void;
  results: number;
}

const QUICK = ["cueva", "museo", "patrimonio", "taíno", "montaña", "playa"];

export default function FilterBar({ value, onChange, onSearch, results }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...value, ...patch });
  const active = Object.values(value).filter(Boolean).length;

  return (
    <div className="rounded-[1.6rem] border-2 border-ink bg-cream p-4 pe-shadow md:p-6">
      <div className="grid gap-4 lg:grid-cols-12">
        <label className="block lg:col-span-4">
          <span className="mb-1.5 flex items-center gap-1.5 text-[0.66rem] font-bold tracking-[0.2em] text-ink/55 uppercase">
            <Search className="h-3.5 w-3.5" /> Buscar
          </span>
          <input
            className="pe-field"
            placeholder="Cueva, museo, Trujillo, manglar…"
            value={value.q}
            onChange={(e) => set({ q: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 text-[0.66rem] font-bold tracking-[0.2em] text-ink/55 uppercase">
            <MapPin className="h-3.5 w-3.5" /> Provincia
          </span>
          <select className="pe-field" value={value.province} onChange={(e) => set({ province: e.target.value })}>
            <option value="">Todas</option>
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 text-[0.66rem] font-bold tracking-[0.2em] text-ink/55 uppercase">
            <BookOpenText className="h-3.5 w-3.5" /> Asignatura
          </span>
          <select className="pe-field" value={value.subject} onChange={(e) => set({ subject: e.target.value })}>
            <option value="">Todas</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 text-[0.66rem] font-bold tracking-[0.2em] text-ink/55 uppercase">
            <Shapes className="h-3.5 w-3.5" /> Tipo
          </span>
          <select className="pe-field" value={value.type} onChange={(e) => set({ type: e.target.value })}>
            <option value="">Todos</option>
            {EXCURSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block lg:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 text-[0.66rem] font-bold tracking-[0.2em] text-ink/55 uppercase">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Nivel
          </span>
          <select className="pe-field" value={value.level} onChange={(e) => set({ level: e.target.value })}>
            <option value="">Todos</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-ink/20 pt-3">
        <span className="text-[0.66rem] font-bold tracking-[0.2em] text-ink/45 uppercase">Rápido:</span>
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => set({ q })}
            className={`pe-chip transition-colors hover:border-terra hover:bg-sun/40 ${
              value.q === q ? "border-terra bg-sun/60" : "bg-cream"
            }`}
          >
            {q}
          </button>
        ))}

        <span className="ml-auto flex items-center gap-3">
          <span className="font-display text-sm font-black">
            {results} destino{results === 1 ? "" : "s"}
          </span>
          {active > 0 && (
            <button
              onClick={() => onChange(EMPTY_FILTERS)}
              className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-cream px-3 py-1.5 text-xs font-bold transition-colors hover:bg-terra hover:text-cream"
            >
              <X className="h-3.5 w-3.5" /> Limpiar ({active})
            </button>
          )}
        </span>
      </div>
    </div>
  );
}
