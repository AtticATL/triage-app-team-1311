import { z } from "zod";

/**
 * Data type for a triage question we ask of the patient.
 *
 * For now, we only include text---but this could be extended to include
 * answer type (multiple-choice rather than true-false, for instance).
 */
export const Question = z.object({ text: z.string() });
export type Question = z.infer<typeof Question>;

/**
 * List of triage questions that we ask about the patient.
 */
export const QUESTIONS = Object.freeze({
  difficultyBreathing: { text: "The patient has difficulty breathing" },
  difficultySwallowing: { text: "The patient has difficulty swallowing" },
  tbd: { text: "(remainder of the checklist data TBD)" },
} as const);

/**
 * Set of question IDs representing every triage question.
 */
export const CHECKLIST: Array<keyof typeof QUESTIONS> = Object.keys(
  QUESTIONS
) as Array<keyof typeof QUESTIONS>;

/**
 * A default-false answer record for every question in QUESTION_KEYS
 */
export const EMPTY_ANSWER_RECORD = Object.freeze(
  CHECKLIST.map((k) => ({
    [k as keyof typeof QUESTIONS]: false as const,
  })).reduce((a, b) => ({ ...a, ...b }), {})
);
