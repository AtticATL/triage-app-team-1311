export interface Profile {
  // ----- Demographics

  // Patient name
  name: Name;

  // Patient biological sex. For the purposes of this tool we're ignoring gender.
  sex: Sex;

  // Patient birth year
  birthYear: number;

  // Patient's medical history (paragraph text)
  pastHistory: string;

  // The history of the current infection (paragraph text)
  currentInfectionHistory: string;

  // Any other user-supplied notes (paragraph text)
  otherNotes: string;
}

// Patient name
export interface Name {
  given: string;
  family: string;
  middle?: string;
}

// Patient biological sex
export type Sex = "male" | "female" | "other";
