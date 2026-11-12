import type { DomainId } from "../types";
export const domains: {
  id: DomainId;
  name: string;
  short: string;
  weight: number;
  color: string;
  description: string;
}[] = [
  {
    id: "cloud",
    name: "Cloud Concepts",
    short: "Cloud Concepts",
    weight: 24,
    color: "#7754d3",
    description: "El porqué detrás de la nube.",
  },
  {
    id: "security",
    name: "Security & Compliance",
    short: "Security",
    weight: 30,
    color: "#a87332",
    description: "Protege los datos y diseña con confianza.",
  },
  {
    id: "technology",
    name: "Cloud Technology & Services",
    short: "Technology",
    weight: 34,
    color: "#4375bc",
    description: "El servicio adecuado para cada desafío.",
  },
  {
    id: "billing",
    name: "Billing, Pricing & Support",
    short: "Billing",
    weight: 12,
    color: "#36816e",
    description: "Entiende el valor y controla los costos.",
  },
];
