import { jsPDF } from "jspdf";
import type { Destination } from "../data/types";
import { ACCESS_META, subjectLabel } from "../data/types";
import { formatDOP, type Trip } from "./trip";

type RGB = [number, number, number];
const INK: RGB = [23, 33, 28];
const PINE: RGB = [30, 59, 45];
const TERRA: RGB = [196, 86, 43];
const SAND: RGB = [216, 201, 163];
const CREAM: RGB = [250, 245, 231];
const GRAY: RGB = [110, 112, 105];

const PW = 612;
const PH = 792;
const M = 52;
const CW = PW - M * 2;

function band(doc: jsPDF, kicker: string, title: string, subtitle: string) {
  doc.setFillColor(...PINE);
  doc.rect(0, 0, PW, 118, "F");
  doc.setFillColor(...TERRA);
  doc.rect(0, 118, PW, 6, "F");
  doc.setTextColor(...SAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(kicker.toUpperCase(), M, 34);
  doc.setTextColor(...CREAM);
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  const lines = doc.splitTextToSize(title, CW) as string[];
  doc.text(lines.slice(0, 2), M, 62);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...SAND);
  doc.text(doc.splitTextToSize(subtitle, CW), M, 62 + Math.min(lines.length, 2) * 22 + 8);
  return 150;
}

function footers(doc: jsPDF, label: string) {
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setDrawColor(...SAND);
    doc.setLineWidth(0.7);
    doc.line(M, PH - 40, PW - M, PH - 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(`${label} · Primitivos Explorer — Excursiones educativas RD`, M, PH - 26);
    doc.text(`Página ${i} de ${total}`, PW - M, PH - 26, { align: "right" });
  }
}

function ensure(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PH - 60) {
    doc.addPage();
    return M;
  }
  return y;
}

function section(doc: jsPDF, y: number, num: string, title: string): number {
  y = ensure(doc, y, 40);
  doc.setFillColor(...TERRA);
  doc.circle(M + 8, y - 4, 9, "F");
  doc.setTextColor(...CREAM);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(num, M + 8, y - 1, { align: "center" });
  doc.setTextColor(...INK);
  doc.setFont("times", "bold");
  doc.setFontSize(15);
  doc.text(title, M + 24, y + 1);
  doc.setDrawColor(...SAND);
  doc.line(M + 24, y + 7, PW - M, y + 7);
  return y + 22;
}

function bullet(doc: jsPDF, y: number, text: string, indent = 0): number {
  const x = M + indent;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  const lines = doc.splitTextToSize(text, CW - indent - 14) as string[];
  y = ensure(doc, y, lines.length * 12.5 + 6);
  doc.setFillColor(...TERRA);
  doc.circle(x + 3, y - 3, 1.8, "F");
  doc.text(lines, x + 12, y);
  return y + lines.length * 12.5 + 4;
}

function meta(doc: jsPDF, x: number, y: number, label: string, value: string, w = 150) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text(label.toUpperCase(), x, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text(doc.splitTextToSize(value, w).slice(0, 2), x, y + 13);
}

function costTable(doc: jsPDF, y: number, trip: Trip): number {
  trip.lines.forEach((l) => {
    y = ensure(doc, y, 26);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(doc.splitTextToSize(l.label, CW - 110)[0], M, y);
    doc.text(formatDOP(l.amount), PW - M, y, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRAY);
    doc.text(doc.splitTextToSize(l.detail, CW - 110)[0], M, y + 11);
    y += 24;
  });

  y = ensure(doc, y, 70);
  doc.setDrawColor(...INK);
  doc.setLineWidth(1);
  doc.line(M, y, PW - M, y);
  y += 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  doc.text(`Total del grupo (${trip.students} estudiantes + ${trip.teachers} docentes cortesía)`, M, y);
  doc.text(formatDOP(trip.total), PW - M, y, { align: "right" });
  y += 22;

  doc.setFillColor(...PINE);
  doc.roundedRect(M, y - 14, CW, 44, 8, 8, "F");
  doc.setTextColor(...SAND);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("ESTIMADO POR ESTUDIANTE", M + 14, y + 2);
  doc.setTextColor(...CREAM);
  doc.setFont("times", "bold");
  doc.setFontSize(20);
  doc.text(formatDOP(trip.perStudentRounded), M + 14, y + 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...SAND);
  doc.text(`${trip.buses} autobús(es) · ~${trip.totalKm} km · ${trip.dests.length} destino(s)`, PW - M - 14, y + 18, {
    align: "right",
  });
  return y + 48;
}

/* ------------------------------------------------------------------ */
/*  GUÍA PEDAGÓGICA DE UN DESTINO                                      */
/* ------------------------------------------------------------------ */
export function downloadGuide(dest: Destination, trip: Trip | null) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  let y = band(
    doc,
    "Primitivos Explorer · Guía pedagógica de campo",
    dest.name,
    `${dest.province} · ${dest.type} · ${dest.level} (${dest.grades})`,
  );

  meta(doc, M, y, "Duración", dest.duration, 140);
  meta(doc, M + 170, y, "Distancia", `${dest.distanceKm} km · ${dest.travelTime}`, 140);
  meta(doc, M + 340, y, "Temporada", dest.bestSeason, 150);
  y += 46;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text("ASIGNATURAS VINCULADAS", M, y);
  doc.setFontSize(10.5);
  doc.setTextColor(...TERRA);
  doc.text(dest.subjects.map(subjectLabel).join("  ·  "), M, y + 13);
  y += 32;

  // acceso
  doc.setFillColor(243, 237, 220);
  const accLines = doc.splitTextToSize(`${ACCESS_META[dest.access].label.toUpperCase()}: ${dest.accessNote}`, CW - 28) as string[];
  const accH = accLines.length * 11 + 20;
  doc.roundedRect(M, y, CW, accH, 7, 7, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...INK);
  doc.text(accLines, M + 14, y + 15);
  y += accH + 20;

  y = section(doc, y, "01", "Objetivos de aprendizaje");
  dest.guide.objetivos.forEach((o) => (y = bullet(doc, y, o)));
  y += 8;

  y = section(doc, y, "02", "Datos curiosos para enganchar al grupo");
  dest.curiosities.forEach((c) => (y = bullet(doc, y, c)));
  y += 8;

  y = section(doc, y, "03", "Conexión con el currículo escolar");
  dest.curricular.forEach((c) => {
    y = ensure(doc, y, 46);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...PINE);
    doc.text(c.title, M, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...TERRA);
    doc.text(subjectLabel(c.subject).toUpperCase(), M, y + 12);
    y += 26;
    c.points.forEach((p) => (y = bullet(doc, y, p, 6)));
    y += 6;
  });

  y = section(doc, y, "04", "Plan de actividades pedagógicas");
  (
    [
      ["Antes del viaje (en el aula)", dest.guide.antes],
      ["Durante la excursión (en terreno)", dest.guide.durante],
      ["Después del viaje (consolidación)", dest.guide.despues],
    ] as [string, string[]][]
  ).forEach(([t, items]) => {
    y = ensure(doc, y, 36);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...PINE);
    doc.text(t, M, y);
    y += 16;
    items.forEach((p) => (y = bullet(doc, y, p, 6)));
    y += 6;
  });

  y = ensure(doc, y, 70);
  doc.setFillColor(250, 245, 231);
  doc.setDrawColor(...SAND);
  doc.roundedRect(M, y, CW, 56, 8, 8, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...TERRA);
  doc.text("VOCABULARIO CLAVE", M + 14, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(doc.splitTextToSize(dest.guide.vocabulario.join("  ·  "), CW - 28), M + 14, y + 36);
  y += 76;

  y = section(doc, y, "05", "Protocolo de seguridad");
  dest.safety.forEach((s) => (y = bullet(doc, y, s)));

  if (trip && trip.dests.length) {
    y += 8;
    y = section(doc, y, "06", "Presupuesto estimado");
    y = costTable(doc, y, trip);
  }

  footers(doc, "Guía pedagógica");
  doc.save(`primitivos-guia-${dest.slug}.pdf`);
}

/* ------------------------------------------------------------------ */
/*  ITINERARIO DEL VIAJE (uno o varios destinos)                       */
/* ------------------------------------------------------------------ */
export function downloadItinerary(trip: Trip) {
  if (!trip.dests.length) return;
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const title = trip.dests.length === 1 ? trip.dests[0].name : `Ruta de ${trip.dests.length} destinos`;

  let y = band(
    doc,
    "Primitivos Explorer · Itinerario de excursión",
    title,
    trip.dests.map((d) => `${d.name} (${d.province})`).join(" · "),
  );

  meta(doc, M, y, "Grupo", `${trip.students} estudiantes`, 140);
  meta(doc, M + 170, y, "Docentes cortesía", `${trip.teachers} acompañantes`, 140);
  meta(doc, M + 340, y, "Transporte", `${trip.buses} autobús(es) · ~${trip.totalKm} km`, 150);
  y += 50;

  trip.dests.forEach((d, di) => {
    y = section(doc, y, String(di + 1).padStart(2, "0"), `${d.name} — cronograma`);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    doc.text(doc.splitTextToSize(`${d.duration} · ${d.travelTime} · ${ACCESS_META[d.access].label}`, CW), M, y);
    y += 18;

    d.itinerary.forEach((s, i) => {
      y = ensure(doc, y, 40);
      if (i % 2 === 0) {
        doc.setFillColor(246, 240, 224);
        doc.rect(M - 6, y - 13, CW + 12, 34, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(...TERRA);
      doc.text(s.time, M + 4, y + 1);
      doc.setTextColor(...INK);
      doc.text(doc.splitTextToSize(s.title, CW - 110)[0], M + 92, y - 2);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(...GRAY);
      doc.text(doc.splitTextToSize(s.detail, CW - 110)[0], M + 92, y + 11);
      y += 38;
    });
    y += 10;
  });

  y = section(doc, y, "$$", "Costos del viaje");
  y = costTable(doc, y, trip);

  y = section(doc, y, "!!", "Recordatorios de seguridad");
  const safety = Array.from(new Set(trip.dests.flatMap((d) => d.safety))).slice(0, 7);
  safety.forEach((s) => (y = bullet(doc, y, s)));

  footers(doc, "Itinerario de excursión");
  doc.save(`primitivos-itinerario-${trip.dests.map((d) => d.slug).join("-").slice(0, 60)}.pdf`);
}
