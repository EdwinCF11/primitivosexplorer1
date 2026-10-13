import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, Mail, MapPin } from "lucide-react";
import { DESTINATIONS } from "../data/destinations";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute -top-24 -right-24 opacity-[0.07]">
        <Compass className="pe-spin-slow h-[420px] w-[420px]" strokeWidth={0.6} />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-10 border-b border-cream/15 pb-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="pe-kicker mb-4 text-ember">Próxima salida</p>
            <h2 className="font-display text-4xl leading-[1.02] font-black md:text-6xl">
              ¿Listos para
              <br />
              <span className="pe-outline-cream italic">la expedición?</span>
            </h2>
          </div>
          <Link
            to="/calculadora"
            className="group inline-flex w-fit items-center gap-3 rounded-full border-2 border-cream bg-terra px-7 py-4 font-semibold transition-all hover:-translate-y-0.5 hover:bg-ember"
          >
            Armar el presupuesto
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
          </Link>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-3 flex items-center gap-2 font-display text-xl font-black">
              <Compass className="h-5 w-5 text-ember" /> PRIMITIVOS EXPLORER
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-cream/65">
              Plataforma de excursiones educativas que conecta el currículo escolar con los tesoros naturales e
              históricos de la República Dominicana. Del aula al territorio, sin complicaciones de logística.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="pe-kicker mb-4 text-cream/45">Destinos</p>
            <ul className="space-y-2 text-sm">
              {DESTINATIONS.slice(0, 5).map((d) => (
                <li key={d.id}>
                  <Link to={`/destino/${d.slug}`} className="text-cream/75 transition-colors hover:text-ember">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="pe-kicker mb-4 text-cream/45">Recursos docentes</p>
            <ul className="space-y-2 text-sm text-cream/75">
              <li>
                <Link to="/calculadora" className="transition-colors hover:text-ember">
                  Calculadora de presupuesto
                </Link>
              </li>
              <li>Guías pedagógicas descargables en PDF</li>
              <li>Itinerarios y protocolos de seguridad</li>
            </ul>
            <div className="mt-6 space-y-2 text-sm text-cream/55">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-ember" /> hola@primitivosexplorer.do
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-ember" /> Santo Domingo, República Dominicana
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-cream/15 pt-6 text-xs tracking-wider text-cream/45 md:flex-row md:items-center">
          <p>© 2026 Primitivos Explorer · Proyecto educativo</p>
          <p className="tracking-[0.3em] uppercase">Del aula al territorio</p>
        </div>
      </div>
    </footer>
  );
}
