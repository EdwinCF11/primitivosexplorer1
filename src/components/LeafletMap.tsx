import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapPoint {
  coords: [number, number];
  label: string;
  kind?: "dest" | "base";
  href?: string;
}

interface Props {
  points: MapPoint[];
  route?: [number, number][];
  className?: string;
  fitPadding?: number;
}

export default function LeafletMap({ points, route, className = "", fitPadding = 50 }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const key = JSON.stringify([points, route, fitPadding]);

  useEffect(() => {
    if (!container.current || mapRef.current) return;
    const map = L.map(container.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });
    map.attributionControl.setPrefix(false);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      maxZoom: 18,
    }).addTo(map);
    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 300);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);

    points.forEach((p) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="pe-pin ${p.kind === "base" ? "pe-pin-base" : ""}"><i></i></div>`,
        iconSize: [34, 34],
        iconAnchor: [6, 30],
      });
      const mk = L.marker(p.coords, { icon }).addTo(layer);
      mk.bindTooltip(p.label, { className: "pe-tip", direction: "top", offset: [0, -6] });
      if (p.href) mk.on("click", () => (window.location.href = p.href!));
    });

    if (route && route.length > 1) {
      L.polyline(route, {
        color: "#c4562b",
        weight: 4,
        dashArray: "2 10",
        lineCap: "round",
        opacity: 0.9,
      }).addTo(layer);
    }

    const all = [...points.map((p) => p.coords), ...(route ?? [])];
    if (all.length > 1) {
      map.fitBounds(L.latLngBounds(all), { padding: [fitPadding, fitPadding] });
    } else if (all.length === 1) {
      map.setView(all[0], 13);
    }
    setTimeout(() => map.invalidateSize(), 120);

    return () => {
      layer.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <div ref={container} className={`min-h-[320px] w-full ${className}`} />;
}
