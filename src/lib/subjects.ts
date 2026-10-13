import { BookOpen, FlaskConical, Landmark, Palette, Sigma, type LucideIcon } from "lucide-react";
import type { SubjectId } from "../data/types";

export const SUBJECT_ICONS: Record<SubjectId, LucideIcon> = {
  matematica: Sigma,
  ciencias: FlaskConical,
  sociales: Landmark,
  lengua: BookOpen,
  arte: Palette,
};

export const SUBJECT_BLURB: Record<SubjectId, string> = {
  matematica: "Medición real, escala, proporción y estimación fuera del cuaderno.",
  ciencias: "Ecosistemas, geología y biodiversidad observados directamente en el campo.",
  sociales: "Historia, patrimonio y geografía contada por el propio territorio.",
  lengua: "Crónicas, textos argumentativos y vocabulario con propósito real.",
  arte: "Arquitectura, arte rupestre y lenguaje visual leídos en su contexto original.",
};
