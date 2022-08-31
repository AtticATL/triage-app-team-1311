import { z } from "zod";

/**
 * Data type for tbe injury location regions
 *
 */
export const Section = z.object({ text: z.string() });
export type Section = z.infer<typeof Section>;

/**
 * List of different regions
 */
export const REGIONAREAS = Object.freeze({
  // Mandibular
  test: { text: "Test injury region" },
  VestibularAbscess: { text: "Vestibular Abscess" },
  Submandibular: { text: "Submandibular" },
  Sublingual: { text: "Sublingual" },
  Submental: { text: "Submental" },
  MedialMasticator: { text: "Medial Masticator" },
  LateralMasticator: { text: "Lateral Masticator" },
  LateralPharyngeal: { text: "Lateral Pharyngeal" },
  Retropharyngeal: { text: "Retropharyngeal" },
  CarotidSheath: { text: "Carotid Sheath" },
  Pretracheal: { text: "Pretracheal" },
  Visceral: { text: "Visceral" },
  TheDangerSpace: { text: "The Danger Space" },
  // Maxillary
  Vestibular: { text: "Vestibular" },
  Canine: { text: "Canine" },
  Infraorbital: { text: "Infraorbital" },
  Palatal: { text: "Palatal" },
  Orbital: { text: "Orbital" },
  Temporal: { text: "Temporal" },
  Infratemporal: { text: "Infratemporal" },
} as const);

/**
 * Set of IDs representing mandibular regions.
 */
export const MANDIBULAR: Array<keyof typeof REGIONAREAS> = [
  "VestibularAbscess",
  "Submandibular",
  "Sublingual",
  "Submental",
  "MedialMasticator",
  "LateralMasticator",
  "LateralPharyngeal",
  "Retropharyngeal",
  "CarotidSheath",
  "Pretracheal",
  "Visceral",
  "TheDangerSpace",
];

/**
 * Set of IDs representing maxillary regions.
 */
export const MAXILLARY: Array<keyof typeof REGIONAREAS> = [
  "Vestibular",
  "Canine",
  "Infraorbital",
  "Palatal",
  "Orbital",
  "Temporal",
  "Infratemporal",
];

/**
 * Set of IDs representing all of the avalible regions.
 */
export const ALLREGIONS: Array<keyof typeof REGIONAREAS> = Object.keys(
  REGIONAREAS
) as Array<keyof typeof REGIONAREAS>;

/**
 * A default-false record for every region
 */
export const FALSE_REGION_SECTIONS = Object.freeze(
  ALLREGIONS.map((k) => ({
    [k as keyof typeof REGIONAREAS]: false as const,
  })).reduce((a, b) => ({ ...a, ...b }), {})
);
