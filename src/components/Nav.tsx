import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, Menu, X, ArrowUpRight } from "lucide-react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const overHero = location.pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  const goDestinos = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("destinos")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#destinos");
    }
  };

  const linkCls = `text-sm font-medium tracking-wide transition-colors hover:text-terra ${
    overHero ? "text-cream" : "text-ink"
  }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          overHero ? "bg-transparent" : "border-b border-ink/10 bg-bone/92 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span
              className={`grid h-11 w-11 rotate-6 place-items-center border-2 border-ink bg-terra transition-transform duration-300 group-hover:rotate-[-6deg] ${
                overHero ? "pe-shadow-sm shadow-ink/40" : "pe-shadow-sm"
              }`}
            >
              <Compass className="h-6 w-6 text-cream" strokeWidth={2.2} />
            </span>
            <span className="leading-none">
              <span className={`block font-display text-lg font-black tracking-tight ${overHero ? "text-cream" : "text-ink"}`}>
                PRIMITIVOS
              </span>
              <span className="block text-[0.65rem] font-bold tracking-[0.42em] text-terra">EXPLORER</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className={linkCls}>
              Inicio
            </Link>
            <a href="/#destinos" onClick={goDestinos} className={linkCls}>
              Destinos
            </a>
            <Link to="/calculadora" className={linkCls}>
              Calculadora
            </Link>
            <Link
              to="/calculadora"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-terra"
            >
              Planificar viaje
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Link>
          </nav>

          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir menú"
            className={`md:hidden ${overHero ? "text-cream" : "text-ink"}`}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-pine text-cream"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <span className="font-display text-xl font-black">Primitivos Explorer</span>
              <button onClick={() => setOpen(false)} aria-label="Cerrar menú">
                <X className="h-7 w-7" />
              </button>
            </div>
            <div className="flex flex-1 flex-col items-start justify-center gap-2 px-8">
              {[
                { label: "Inicio", to: "/" },
                { label: "Destinos", onClick: goDestinos },
                { label: "Calculadora", to: "/calculadora" },
              ].map((l, i) =>
                l.to ? (
                  <Link key={l.label} to={l.to} className="group flex items-baseline gap-4">
                    <span className="text-sm text-ember">0{i + 1}</span>
                    <span className="font-display text-5xl font-black transition-colors group-hover:text-ember">
                      {l.label}
                    </span>
                  </Link>
                ) : (
                  <a key={l.label} href="/#destinos" onClick={l.onClick} className="group flex items-baseline gap-4">
                    <span className="text-sm text-ember">0{i + 1}</span>
                    <span className="font-display text-5xl font-black transition-colors group-hover:text-ember">
                      {l.label}
                    </span>
                  </a>
                ),
              )}
            </div>
            <p className="px-8 pb-8 text-xs tracking-[0.3em] text-cream/50 uppercase">
              Excursiones educativas · República Dominicana
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
