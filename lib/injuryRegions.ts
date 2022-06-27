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
  // Mandibular Spaces
  test: { text: "Test injury region" },
  VestibularAbscess: { text: "Vestibular Abscess" },
  SubmandibularSpace: { text: "Submandibular Space" },
  SublingualSpace: { text: "Sublingual Space" },
  SubmentalSpace: { text: "Submental Space" },
  MedialMasticatorSpace: { text: "Medial Masticator Space" },
  LateralMasticatorSpace: { text: "Lateral Masticator Space" },
  LateralPharyngealSpace: { text: "Lateral Pharyngeal Space" },
  RetropharyngealSpace: { text: "Retropharyngeal Space" },
  CarotidSheath: { text: "Carotid Sheath" },
  PretrachealSpace: { text: "Pretracheal Space" },
  VisceralSpace: { text: "Visceral Space" },
  TheDangerSpace: { text: "The Danger Space" },
  // Maxillary Spaces
  VestibularSpace: { text: "Vestibular Space" },
  CanineSpace: { text: "Canine Space" },
  InfraorbitalSpace: { text: "Infraorbital Space" },
  PalatalSpace: { text: "Palatal Space" },
  OrbitalSpace: { text: "Orbital Space" },
  TemporalSpace: { text: "Temporal Space" },
  InfratemporalSpace: { text: "Infratemporal Space" },
} as const);

/**
 * Set of IDs representing mandibular regions.
 */
export const MANDIBULAR: Array<keyof typeof REGIONAREAS> = [
  "VestibularAbscess",
  "SubmandibularSpace",
  "SublingualSpace",
  "SubmentalSpace",
  "MedialMasticatorSpace",
  "LateralMasticatorSpace",
  "LateralPharyngealSpace",
  "RetropharyngealSpace",
  "CarotidSheath",
  "PretrachealSpace",
  "VisceralSpace",
  "TheDangerSpace",
];

/**
 * Set of IDs representing maxillary regions.
 */
export const MAXILLARY: Array<keyof typeof REGIONAREAS> = [
  "VestibularSpace",
  "CanineSpace",
  "InfraorbitalSpace",
  "PalatalSpace",
  "OrbitalSpace",
  "TemporalSpace",
  "InfratemporalSpace",
];

/**
 * Set of IDs representing all of the avalible regions.
 */
export const ALLREGIONS: Array<keyof typeof REGIONAREAS> = [
  "VestibularAbscess",
  "SubmandibularSpace",
  "SublingualSpace",
  "SubmentalSpace",
  "MedialMasticatorSpace",
  "LateralMasticatorSpace",
  "LateralPharyngealSpace",
  "RetropharyngealSpace",
  "CarotidSheath",
  "PretrachealSpace",
  "VisceralSpace",
  "TheDangerSpace",
  "VestibularSpace",
  "CanineSpace",
  "InfraorbitalSpace",
  "PalatalSpace",
  "OrbitalSpace",
  "TemporalSpace",
  "InfratemporalSpace",
];

/**
 * A default-false record for every region
 */
export const FALSE_REGION_SECTIONS = Object.freeze(
  ALLREGIONS.map((k) => ({
    [k as keyof typeof REGIONAREAS]: false as const,
  })).reduce((a, b) => ({ ...a, ...b }), {})
);
