import { boolean, z } from "zod"; // data validation library
import { REGIONAREAS, REGIONS } from "./injuryRegions";
import { Question, QUESTIONS } from "./triageQuestions";

export const DateStr = z.string().regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/, {
  message: "Date must be valid (yyyy-mm-dd format)",
});
export type DateStr = z.infer<typeof DateStr>;

/**
 * A patient's full name
 */
export const Name = z
  .string()
  .min(2, { message: "Full name must be at least 2 characters long" })
  .max(500, { message: "Full name cannot be longer than 500 characters" });
export type Name = z.infer<typeof Name>;

/**
 * A patient's sex, as assigned at birth
 */
export const Sex = z.enum(["Male", "Female", "Other"]);
export type Sex = z.infer<typeof Sex>;

/**
 * A hex-encoded data string
 */
export const Base64String = z
  .string()
  .min(1)
  .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+\/]{3}=)?$/, {
    message: "Base64-encoded data is invalid.",
  });
export type Base64String = z.infer<typeof Base64String>;

/**
 * Information describing the identity of the patient
 */
export const Identity = z.object({
  name: Name,
  dob: DateStr,
  sex: Sex,
});
export type Identity = z.infer<typeof Identity>;

/**
 * A short paragraph of text, limited to 280 characters.
 */
export const Paragraph = z
  .string()
  .max(280, {
    message: "Try to be more concise here (text cannot exceed 280 characters)",
  })
  .min(10, { message: "Text is too short; use more detail" });
export type Paragraph = z.infer<typeof Paragraph>;

/**
 * Information on the patient's medical history
 */
export const PatientHistory = z.object({
  currentInfectionHistory: Paragraph,
  pastHistory: Paragraph,
  otherNotes: z.string().optional(),
});
export type PatientHistory = z.infer<typeof PatientHistory>;

/**
 * Triage checklist information
 */
export const TriageChecklist = z
  .record(z.boolean())
  .refine((r) => Object.keys(r).every((k) => QUESTIONS.hasOwnProperty(k)), {
    message: "Triage checklist contains question IDs we aren't aware of",
  });
export type TriageChecklist = z.infer<typeof TriageChecklist>;

/**
 * Triage checklist information
 */
export const InfectionRegions = z
  .record(z.boolean())
  .refine((r) => Object.keys(r).every((k) => REGIONAREAS.hasOwnProperty(k)), {
    message: "Infection regions contain IDs of regions we aren't aware of",
  });
export type InfectionRegions = z.infer<typeof InfectionRegions>;

/**
 * Information to retrieve a binary object. We're going to use some sort of
 * content-addressable storage.
 */
export const Handle = z.object({
  id: z.string().uuid({ message: "Data must have a valid UUID" }),
  key: Base64String.length(44, {
    message: "Base64-encoded encryption key must be exactly 44 characters long",
  }),
});
export type Handle = Readonly<z.infer<typeof Handle>>;

/**
 * MIME content types we understand
 */
export const AttachmentType = z.enum([
  "image/png",
  "image/jpeg",
  "video/mp4",
  "video/quicktime",
]);
export type AttachmentType = z.infer<typeof AttachmentType>;

/**
 * Media or file attachment
 */
export const Attachment = z.object({
  mimeType: AttachmentType,
  blob: Handle,
});
export type Attachment = z.infer<typeof Attachment>;

/**
 * A complete patient profile
 */
export const Profile = z.object({
  identity: Identity,
  patientHistory: PatientHistory,
  triageChecklist: TriageChecklist,
  infectionRegions: InfectionRegions,
  attachments: z.array(Attachment),
});
export type Profile = z.infer<typeof Profile>;
