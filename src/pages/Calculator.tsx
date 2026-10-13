import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, ClipboardList, FileText, ListChecks, ShieldCheck, Trash2 } from "lucide-react";
import { DESTINATIONS } from "../data/destinations";
import TripBuilder from "../components/TripBuilder";
import Marquee from "../components/Marquee";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Calculator() {
  const [params] = useSearchParams();
  const requested = params.get("destino");

  const [initial] = useState<string[]>(() => {
    const ids = (requested ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((id) => DESTINATIONS.some((d) => d.id === id));
    return ids.length ? ids : [DESTINATIONS[0].id];
  });

  const highlights = useMemo(
    () => [
      "Añade varios destinos y arma una ruta de dos días",
      "Elimina cualquier línea y el total se recalcula solo",
      "1 docente cortesía por cada 10 estudiantes",
      "Guía pedagógica e itinerario en PDF",
    ],
    [],
  );

  return (
    <main className="pt-[72px]">
      {/* header */}
      <section className="relative overflow-hidden border-b-2 border-ink bg-pine text-cream">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #faf5e7 1.4px, transparent 1.4px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="pe-kicker mb-4 text-ember">
            Laboratorio de presupuesto
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="max-w-3xl font-display text-4xl leading-[1] font-black md:text-6xl"
          >
            Calculadora <span className="pe-outline-cream italic">&amp;</span> itinerario
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-cream/75 md:text-base"
          >
            Arma la ruta con uno o varios destinos, indica cuántos estudiantes viajan y elimina lo que no necesites.
            Todo el presupuesto se recalcula en tiempo real.
          </motion.p>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {highlights.map((h) => (
              <li key={h} className="pe-chip border-cream/30 bg-cream/10 text-cream">
                {h}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <Marquee
        items={["Presupuesto al instante", "Elimina y recalcula", "Guía pedagógica PDF", "Itinerario descargable", "Rutas de varios destinos"]}
        className="border-b-2 border-ink bg-sun text-ink"
        duration="38s"
      />

      {/* constructor */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <TripBuilder initialDestIds={initial} allowMultiple showDownloads />
      </section>

      {/* info */}
      <section className="border-t-2 border-ink bg-parchment/50">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-3 md:px-8 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 28, rotate: 1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="rounded-[1.5rem] border-2 border-ink bg-cream p-6 pe-shadow"
          >
            <p className="flex items-center gap-2 font-display text-xl font-black">
              <FileText className="h-5 w-5 text-terra" /> La guía PDF incluye
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/75">
              {[
                "Objetivos de aprendizaje alineados al currículo",
                "Datos curiosos para enganchar al grupo",
                "Actividades antes, durante y después del viaje",
                "Vocabulario clave y ficha de campo",
                "Protocolo de seguridad y presupuesto",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <ListChecks className="mt-0.5 h-4.5 w-4.5 shrink-0 text-pine" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="rounded-[1.5rem] border-2 border-ink bg-sun p-6 pe-shadow"
          >
            <p className="flex items-center gap-2 font-display text-xl font-black">
              <Trash2 className="h-5 w-5" /> Todo es editable
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink/75">
              Cada línea de la cotización tiene su botón de eliminar. Si quitas un destino, desaparecen sus entradas, se
              recalcula el transporte y cambia el almuerzo. Si quitas el transporte, el sistema asume que el centro
              aporta sus propios autobuses.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              El botón de restablecer devuelve la cotización a su estado inicial en un clic.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
            className="rounded-[1.5rem] border-2 border-ink bg-pine p-6 text-cream pe-shadow"
          >
            <p className="flex items-center gap-2 font-display text-xl font-black">
              <ClipboardList className="h-5 w-5 text-ember" /> Política del programa
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
              {[
                "1 docente acompañante gratis por cada 10 estudiantes.",
                "Reprogramación sin costo por condiciones meteorológicas.",
                "Precios referenciales en RD$, impuestos incluidos.",
                "Sitios con reserva o acceso restringido se gestionan con antelación.",
              ].map((t, i) => (
                <li key={t} className="flex gap-2.5">
                  {i === 3 ? (
                    <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ember" />
                  ) : (
                    <BadgeCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ember" />
                  )}
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
