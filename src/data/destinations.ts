import { normalize, type Destination } from "./types";
import { SITES_A } from "./sites-a";
import { SITES_B } from "./sites-b";

export * from "./types";
export { STOCK, PX, OWN } from "./images";

export const DESTINATIONS: Destination[] = [...SITES_A, ...SITES_B].map(normalize);

/** Punto de salida por defecto de las expediciones escolares */
export const HOME_BASE: { label: string; coords: [number, number] } = {
  label: "Base escolar · Gran Santo Domingo",
  coords: [18.4724, -69.9361],
};

export const PROVINCES: string[] = Array.from(new Set(DESTINATIONS.map((d) => d.province))).sort((a, b) =>
  a.localeCompare(b, "es"),
);

export const REGIONS: string[] = Array.from(new Set(DESTINATIONS.map((d) => d.region))).sort((a, b) =>
  a.localeCompare(b, "es"),
);

export const getDestination = (slug: string) => DESTINATIONS.find((d) => d.slug === slug || d.id === slug);

export const getById = (id: string) => DESTINATIONS.find((d) => d.id === id);

export const FEATURED = DESTINATIONS.filter((d) => d.featured);
