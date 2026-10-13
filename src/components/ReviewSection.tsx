import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, GraduationCap, MessageSquareQuote, PenLine, Send } from "lucide-react";
import { useReviews } from "../hooks/useReviews";
import Stars from "./Stars";

interface Props {
  destId: string;
  destName: string;
}

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" });

export default function ReviewSection({ destId, destName }: Props) {
  const { reviews, stats, addReview } = useReviews(destId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [thanks, setThanks] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !school.trim() || !text.trim()) return;
    addReview({ name: name.trim(), school: school.trim(), rating, text: text.trim() });
    setName("");
    setSchool("");
    setRating(5);
    setText("");
    setThanks(true);
    setTimeout(() => {
      setThanks(false);
      setOpen(false);
    }, 1800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Resumen */}
      <div className="lg:col-span-4">
        <div className="rounded-[1.6rem] border-2 border-ink bg-cream p-6 pe-shadow-soft lg:sticky lg:top-24">
          <p className="pe-kicker mb-3 text-ink/50">Valoración docente</p>
          <div className="flex items-end gap-3">
            <span className="font-display text-6xl leading-none font-black text-pine">{stats.avg.toFixed(1)}</span>
            <div className="pb-1.5">
              <Stars value={stats.avg} size={17} />
              <p className="mt-1 text-xs text-ink/55">{stats.count} reseñas de docentes</p>
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
            {stats.dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-3 font-bold">{d.stars}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full border border-ink/20 bg-parchment">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${stats.count ? (d.count / stats.count) * 100 : 0}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="h-full rounded-full bg-ember"
                  />
                </div>
                <span className="w-5 text-right text-ink/50">{d.count}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ink bg-terra px-4 py-3 font-semibold text-cream transition-all hover:-translate-y-0.5 hover:bg-ink pe-shadow-sm"
          >
            <PenLine className="h-4 w-4" /> {open ? "Cerrar formulario" : "Escribir reseña"}
          </button>
        </div>
      </div>

      {/* Lista + formulario */}
      <div className="space-y-4 lg:col-span-8">
        <AnimatePresence>
          {open && (
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-[1.6rem] border-2 border-ink bg-parchment/50 p-5 md:p-6">
                <p className="mb-4 flex items-center gap-2 font-display text-xl font-black">
                  <GraduationCap className="h-6 w-6 text-terra" />
                  ¿Cómo fue tu excursión a {destName}?
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="pe-field" placeholder="Tu nombre (ej. Prof. Ana Duarte)" value={name} onChange={(e) => setName(e.target.value)} required />
                  <input className="pe-field" placeholder="Centro educativo" value={school} onChange={(e) => setSchool(e.target.value)} required />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.2em] text-ink/55 uppercase">Tu valoración</span>
                  <Stars value={rating} size={24} onChange={setRating} />
                </div>
                <textarea
                  className="pe-field mt-4 min-h-[110px] resize-y"
                  placeholder="Cuenta tu experiencia: la logística, el aprendizaje, consejos para otros docentes…"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-ink/50">Se publica con tu nombre y centro educativo.</p>
                  <button className="flex items-center gap-2 rounded-xl border-2 border-ink bg-ink px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-terra">
                    <Send className="h-4 w-4" /> Publicar reseña
                  </button>
                </div>
                <AnimatePresence>
                  {thanks && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 rounded-lg bg-pine px-3 py-2 text-sm font-semibold text-cream"
                    >
                      ¡Gracias! Tu reseña ya es visible para la comunidad docente.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {reviews.map((r, i) => (
          <motion.article
            key={r.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className={`rounded-[1.4rem] border-2 border-ink bg-cream p-5 pe-shadow-soft md:p-6 ${i % 2 ? "md:-rotate-[0.4deg]" : "md:rotate-[0.4deg]"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Stars value={r.rating} />
              <span className="text-xs text-ink/45">{fmtDate(r.date)}</span>
            </div>
            <p className="mt-3 leading-relaxed text-ink/80">
              <MessageSquareQuote className="mr-2 inline h-5 w-5 align-[-4px] text-terra" />“{r.text}”
            </p>
            <div className="mt-4 flex items-center gap-3 border-t border-dashed border-ink/25 pt-3">
              <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-ink bg-sun font-display text-sm font-black">
                {r.name.replace("Prof. ", "").charAt(0)}
              </span>
              <div>
                <p className="text-sm font-bold">{r.name}</p>
                <p className="text-xs text-ink/55">{r.school}</p>
              </div>
              <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-pine">
                <BadgeCheck className="h-4 w-4" /> Verificada
              </span>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
