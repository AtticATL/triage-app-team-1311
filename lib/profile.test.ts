import * as Profile from "./profile";

describe("birth year", () => {
  it("accepts valid data", () => {
    Profile.BirthYear.parse(2001);
    Profile.BirthYear.parse(1900);
    Profile.BirthYear.parse(2022);
    Profile.BirthYear.parse(new Date().getFullYear());
  });
  it("rejects invalid data", () => {
    expect(() => Profile.BirthYear.parse(9999)).toThrow();
    expect(() => Profile.BirthYear.parse(21)).toThrow();
    expect(() => Profile.BirthYear.parse(2.5)).toThrow();
  });
});

describe("patient name", () => {
  it("accepts valid data", () => {
    expect(Profile.Name.parse("William Goodall"));
  });

  it("rejects invalid data", () => {
    expect(() => Profile.Name.parse("")).toThrow();
    expect(() => Profile.Name.parse(" ")).toThrow();
    expect(() => Profile.Name.parse("x".repeat(1000))).toThrow();
  });
});

describe("patient sex", () => {
  it("accept valid data", () => {
    expect(Profile.Sex.parse("Male"));
    expect(Profile.Sex.parse("Female"));
    expect(Profile.Sex.parse("Other"));
  });

  it("rejects invalid data", () => {
    expect(() => Profile.Sex.parse("")).toThrow();
    expect(() => Profile.Sex.parse(" ")).toThrow();
    expect(() => Profile.Sex.parse("Robert")).toThrow();
  });
});

describe("b64-encoded data", () => {
  it("accepts valid data", () => {
    expect(Profile.Base64String.parse(exampleHandle.key));
  });

  it("rejects invalid data", () => {
    expect(() => Profile.Base64String.parse("")).toThrow();
    expect(() => Profile.Base64String.parse("this is not hex")).toThrow();
  });
});

describe("patient identity", () => {
  it("accepts valid data", () => {
    Profile.Identity.parse({
      name: "Example Person",
      birthYear: 1986,
      sex: "Other",
    });

    Profile.Identity.parse({
      name: "Another Example",
      birthYear: 2002,
      sex: "Female",
    });

    Profile.Identity.parse({
      name: "Yet Another Example",
      birthYear: 2022,
      sex: "Male",
    });
  });

  it("rejects invalid data", () => {
    expect(() => Profile.Identity.parse(null)).toThrow();
    expect(() => Profile.Identity.parse("yeet")).toThrow();

    expect(() =>
      Profile.Identity.parse({
        name: "Not Actually Twenty-One",
        birthYear: 21,
        sex: "Male",
      })
    ).toThrow();

    expect(() =>
      Profile.Identity.parse({
        name: "Sexless",
        birthYear: 2001,
      })
    ).toThrow();
  });
});

describe("patient history", () => {
  it("accepts valid data", () => {
    Profile.PatientHistory.parse({
      pastHistory: "some detail",
      currentInfectionHistory: "some detail",
      otherNotes: "some detail",
    });
  });
  it("rejects invalid data", () => {
    expect(() => {
      Profile.PatientHistory.parse({
        // missing pastHistory
        currentInfectionHistory: "some detail",
        otherNodes: "some detail",
      });
    }).toThrow();
  });
});

describe("triage checklist", () => {
  it("accepts valid data", () => {
    Profile.TriageChecklist.parse({
      test: false,
    });
  });

  it("rejects invalid data", () => {
    expect(() =>
      Profile.TriageChecklist.parse({
        someUnknownKey: true,
      })
    ).toThrow();
  });
});

const exampleHandle = {
  id: "b928b62f-b6dd-4146-8d2e-d06456a558da",
  key: "tXCdeLc4JOxas816eQisjwexlF1jo/Bl3k1ApNOzGAk=",
};

describe("attachment storage", () => {
  it("accepts valid data", () => {
    Profile.Attachment.parse({
      role: "CtScan",
      mimeType: "image/jpeg",
      blob: exampleHandle,
    });
    Profile.Attachment.parse({
      role: "Other",
      mimeType: "image/png",
      blob: exampleHandle,
    });
  });

  it("rejects invalid data", () => {
    expect(() => {
      Profile.Attachment.parse({
        role: "Other",
        mimeType: "application/something-we-dont-know",
        blob: exampleHandle,
      });
    }).toThrow();
    expect(() => {
      Profile.Attachment.parse({
        role: "Other",
        mimeType: "image/jpeg",
        blob: { ...exampleHandle, key: "oops" },
      });
    }).toThrow();
  });
});

describe("patient profile", () => {
  it("accepts valid data", () => {
    Profile.Profile.parse({
      identity: {
        name: "Some Fake Person",
        birthYear: 1981,
        sex: "Female",
      },
      patientHistory: {
        pastHistory: "past history",
        currentInfectionHistory: "current history",
        otherNotes: "other stuff",
      },
      triageChecklist: { test: false },
      infectionRegions: { test: false },
      attachments: [
        {
          role: "Other",
          mimeType: "image/png",
          blob: exampleHandle,
        },
        {
          role: "CtScan",
          mimeType: "image/png",
          blob: exampleHandle,
        },
      ],
    });
  });
  it("rejects invalid data", () => {});
});
