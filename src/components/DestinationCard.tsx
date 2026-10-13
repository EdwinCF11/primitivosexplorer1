import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, MapPin, Sparkles } from "lucide-react";
import { ACCESS_META, subjectLabel, type Destination } from "../data/types";
import { formatDOP } from "../lib/trip";

interface Props {
  dest: Destination;
  index: number;
  className?: string;
}

export default function DestinationCard({ dest, index, className = "" }: Props) {
  const acc = ACCESS_META[dest.access];

  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Link
        to={`/destino/${dest.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border-2 border-ink bg-cream pe-shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:pe-shadow"
      >
        <div className="relative overflow-hidden">
          <img
            src={dest.image}
            alt={dest.name}
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
          <span className="absolute top-3.5 left-4 font-display text-4xl font-black text-cream/90 drop-shadow-[2px_2px_0_rgba(23,33,28,0.6)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="pe-sticker absolute top-3.5 right-3.5 rotate-3 bg-sun text-ink">{dest.type}</span>
          {dest.access !== "libre" && (
            <span className={`pe-chip absolute bottom-3.5 right-3.5 border-ink/40 ${acc.tone}`}>{acc.label}</span>
          )}
          <span className="absolute bottom-3.5 left-4 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-cream uppercase">
            <MapPin className="h-3.5 w-3.5" /> {dest.province}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl leading-tight font-black transition-colors group-hover:text-terra">
            {dest.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/65">{dest.tagline}</p>

          <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-parchment/50 p-2.5 text-xs leading-relaxed text-ink/70">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-terra" />
            <span className="line-clamp-2">{dest.curiosities[0]}</span>
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {dest.subjects.slice(0, 3).map((s) => (
              <span key={s} className="pe-chip bg-parchment/60">
                {subjectLabel(s)}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-dashed border-ink/25 pt-3.5">
            <div className="pt-2">
              <p className="flex items-center gap-1 text-[0.62rem] font-bold tracking-[0.18em] text-ink/45 uppercase">
                <Clock3 className="h-3 w-3" /> {dest.distanceKm} km · desde
              </p>
              <p className="font-display text-lg font-black text-pine">
                {formatDOP(dest.pricePerStudent)}
                <span className="ml-1 align-middle font-sans text-[0.65rem] font-medium text-ink/50">/estud.</span>
              </p>
            </div>
            <span className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-terra text-cream transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
