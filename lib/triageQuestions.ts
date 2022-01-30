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
export const QUESTIONS: Record<string, Question> = Object.freeze({
  test: { text: "This is a test triage checklist question" },
});

/**
 * Set of question IDs representing every triage question.
 */
export const QUESTION_KEYS = Object.freeze(Object.keys(QUESTIONS));
