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
  upperRight: { text: "Upper jaw right region" },
  upperLeft: { text: "Upper jaw left region" },
  lowerRight: { text: "Lower jaw right region" },
  lowerLeft: { text: "Lower jaw left region" },
  neckRight: { text: "Neck right region" },
  neckLeft: { text: "Neck left region" },
} as const);

/**
 * Set of IDs representing every region.
 */
export const REGIONS: Array<keyof typeof REGIONAREAS> = [
  "upperRight",
  "upperLeft",
  "lowerRight",
  "lowerLeft",
  "neckRight",
  "neckLeft",
];

/**
 * A default-false record for every region in QUESTION_KEYS
 */
export const FALSE_REGION_SECTIONS = Object.freeze(
  REGIONS.map((k) => ({
    [k as keyof typeof REGIONAREAS]: false as const,
  })).reduce((a, b) => ({ ...a, ...b }), {})
);
