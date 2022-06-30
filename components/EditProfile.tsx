import * as React from "react";
import * as Profile from "../lib/profile";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CHECKLIST,
  EMPTY_ANSWER_RECORD,
  QUESTIONS,
} from "../lib/triageQuestions";
import {
  FALSE_REGION_SECTIONS,
  MANDIBULAR,
  MAXILLARY,
  REGIONAREAS,
} from "../lib/injuryRegions";
import * as Storage from "../lib/storage/storage";
import { decodeBase64 } from "../lib/storage/encoding";
import { z } from "zod";
import {
  useField,
  TextField,
  EnumField,
  NumberField,
  DateField,
  ParagraphField,
  Entry,
} from "../components/Form";
import Checkbox from "../components/Checkbox";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiChevronDown,
  FiChevronLeft,
  FiChevronUp,
  FiTrash2,
  FiUpload,
  FiUploadCloud,
} from "react-icons/fi";
import BlobMedia from "./BlobMedia";
import {
  Alert,
  Button,
  Heading,
  IconButton,
  Pane,
  Spinner,
  Text,
  toaster,
} from "evergreen-ui";
import { UploadCapturePhoto, UploadCaptureVideo, UploadFile } from "./Upload";

export interface EditProfileProps {
  initial?: Profile.Profile;

  /**
   * Called whenever a new *valid* profile is entered.
   * Called again with `null` if the profile becomes invalid.
   */
  onChange: (updated: Profile.Profile | null) => unknown;
}

export default function EditProfile({ initial, onChange }: EditProfileProps) {
  // Keep track of the state of the profile fields
  const name = useField(Profile.Name, initial?.identity?.name);
  const dob = useField(Profile.DateStr, initial?.identity?.dob);
  const sex = useField(Profile.Sex, initial?.identity?.sex);
  const currentInfectionHistory = useField(
    Profile.Paragraph,
    initial?.patientHistory?.currentInfectionHistory
  );
  const pastHistory = useField(
    Profile.Paragraph,
    initial?.patientHistory?.pastHistory
  );
  const otherNotes = useField(
    z.optional(Profile.Paragraph),
    initial?.patientHistory?.otherNotes
  );

  // Track the true/false answers to triage questions
  let [answers, setAnswers] = useState<Record<string, boolean>>(
    initial?.triageChecklist ?? EMPTY_ANSWER_RECORD
  );

  // Track the true/false regions to injury regions
  let [regions, setRegions] = useState<Record<string, boolean>>(
    initial?.infectionRegions ?? FALSE_REGION_SECTIONS
  );

  // Store attachments
  let [uploads, setUploads] = useState<
    Array<{ attachment: Profile.Attachment; earlyHandle?: Storage.EarlyHandle }>
  >(initial ? initial.attachments.map((a) => ({ attachment: a })) : []);

  const attach = useCallback(async (file: File) => {
    if (navigator.storage && !!navigator.storage.persist) {
      const isPeristed = await navigator.storage.persist();
      if (!isPeristed) {
        console.warn("User should try to allow persistent storage");
      }
    }

    // Check the filetype
    const typeResult = Profile.AttachmentType.safeParse(file.type);
    if (!typeResult.success) {
      toaster.danger(`We can't upload a file of this type (${file.type})`);
      return;
    }

    console.log("[upload] call Storage.put");
    let earlyHandle = await Storage.put(await file.arrayBuffer());

    setUploads((as) => [
      ...as,
      {
        attachment: {
          role: "Other",
          mimeType: typeResult.data,
          blob: earlyHandle.handle,
        },
        earlyHandle,
      },
    ]);
  }, []);

  // Track whether all the uploads are durably uploaded
  let [uploadsReady, setUploadsReady] = useState(false);
  useEffect(() => {
    let cancelled = false;

    // Flag uploads as not ready
    setUploadsReady(false);

    // Flag uploads as ready when they all complete.
    const durableProms = uploads
      .map((u) => u.earlyHandle?.waitForDurableStorage)
      .filter((p) => p != null);

    if (durableProms.length == 0) {
      setUploadsReady(true); // true if we're not waiting
    } else {
      Promise.all(durableProms).then(() => {
        if (!cancelled) {
          setUploadsReady(true);
        }
      });
    }

    // If we re-evaluate the effect, never setUploadsReady
    return () => {
      cancelled = true;
    };
  }, [uploads]);

  const draftValidation = useMemo(() => {
    const partialProfileValidator = Profile.Profile.deepPartial();
    const draftProfile: z.infer<typeof partialProfileValidator> = {
      identity: {
        name: name.value,
        dob: dob.value,
        sex: sex.value,
      },
      triageChecklist: answers,
      infectionRegions: regions,
      patientHistory: {
        currentInfectionHistory: currentInfectionHistory.value,
        pastHistory: pastHistory.value,
        otherNotes: otherNotes.value,
      },
      attachments: uploads.map((u) => u.attachment),
    };

    return Profile.Profile.safeParse(draftProfile);
  }, [
    name.value,
    dob.value,
    sex.value,
    currentInfectionHistory.value,
    pastHistory.value,
    otherNotes.value,
    answers,
    regions,
    uploads,
  ]);

  const submitted = useMemo(() => {
    if (draftValidation.success && uploadsReady) {
      onChange(draftValidation.data);
    } else {
      onChange(null);
    }
  }, [draftValidation, uploadsReady, onChange]);

  return (
    <Pane display="flex" flexDirection="column" gap={32}>
      <Pane display="flex" flexDirection="column" gap={16}>
        <Heading size={600}>Identity</Heading>
        <TextField
          field={name}
          label="Name"
          help="The patient's full legal name"
        />
        <EnumField
          field={sex}
          label="Sex"
          help="The patient's sex, as assigned at birth"
        />
        <DateField field={dob} label="Date of Birth" />
      </Pane>

      <Pane gap={16} display="flex" flexDirection="column">
        <Heading size={600}>History</Heading>
        <Text>
          The {"patient's"} medical history, as well as the history of the
          present infection.
        </Text>

        <ParagraphField
          field={currentInfectionHistory}
          label="Infection History"
          help="The history of the current infection"
        />

        <ParagraphField
          field={pastHistory}
          label="Past History"
          help="The past medical history of the patient"
        />

        <ParagraphField
          field={otherNotes}
          label="Other Notes"
          help="Any other important information"
        />
      </Pane>
      <Pane gap={16} display="flex" flexDirection="column">
        <Heading>Triage Checklist</Heading>
        <Text>
          Answers to these questions can help determine the severity of this
          {" patient's "} case.
        </Text>
        <Entry>
          {CHECKLIST.map((id) => (
            <Checkbox
              key={id}
              checked={answers[id]}
              label={QUESTIONS[id].text}
              onChange={(v) => setAnswers((a) => ({ ...a, [id]: v }))}
            />
          ))}
        </Entry>
      </Pane>

      <Pane gap={16} display="flex" flexDirection="column">
        <Heading>Infection Regions</Heading>
        <Text>
          Designate the affected regions of the face for the {" patient's "}
          odontogenic injury.
        </Text>
        <Pane gap={16} display="flex" flexDirection="column">
          <Entry>
            <Pane flex={1} marginLeft={8}>
              <Text fontWeight="bold" marginX={2}>
                Mandibular Spaces
              </Text>
            </Pane>
            <Entry>
              {MANDIBULAR.map((id) => (
                <Checkbox
                  key={id}
                  checked={regions[id]}
                  label={REGIONAREAS[id].text}
                  onChange={(v) => setRegions((a) => ({ ...a, [id]: v }))}
                />
              ))}
            </Entry>
          </Entry>

          <Entry>
            <Pane flex={1} marginLeft={8}>
              <Text fontWeight="bold" marginX={2}>
                Maxillary Spaces
              </Text>
            </Pane>
            <Entry>
              {MAXILLARY.map((id) => (
                <Checkbox
                  key={id}
                  checked={regions[id]}
                  label={REGIONAREAS[id].text}
                  onChange={(v) => setRegions((a) => ({ ...a, [id]: v }))}
                />
              ))}
            </Entry>
          </Entry>
        </Pane>
      </Pane>

      <Pane gap={16} display="flex" flexDirection="column">
        <Heading>Imaging and Attachments</Heading>
        <Text>
          Upload photos of CT scans or any other relevant imagery. Quality is
          not very important here: photos of your computer screen are okay.
        </Text>

        {uploads.map(({ attachment, earlyHandle }) => (
          <Entry key={attachment.blob.id}>
            <BlobMedia attachment={attachment} />
            <Pane display="flex" justifyContent="flex-end" alignItems="center">
              <IconButton
                appearance="minimal"
                intent="danger"
                size="large"
                onClick={() => {
                  setUploads((us) =>
                    us.filter((u) => u.attachment.blob.id != attachment.blob.id)
                  );
                }}
                icon={FiTrash2}
              />
            </Pane>
          </Entry>
        ))}

        <Pane marginTop={16} display="flex" alignItems="row" gap={8}>
          <UploadCapturePhoto onUpload={(f) => attach(f)} />
          <UploadCaptureVideo onUpload={(f) => attach(f)} />
          <UploadFile onUpload={(f) => attach(f)} />
        </Pane>
      </Pane>

      <Pane marginTop={8} gap={16}>
        {!uploadsReady && (
          <Alert intent="none" title="Processing Attachments...">
            <Spinner marginX="auto" size={24} />
          </Alert>
        )}

        {!draftValidation.success && (
          <Alert
            intent="danger"
            alignItems="stretch"
            paddingLeft={4}
            paddingY={8}
            title="This profile can't be submitted yet."
          >
            <Pane alignItems="flex-start">
              <Text>We found these problems with the data you entered:</Text>
              {draftValidation.error.issues.map((issue, i) => (
                <Text display="block" marginLeft={8} key={i}>
                  {issue.message}
                </Text>
              ))}
              <Text marginTop={3}>Fix these issues to submit the profile.</Text>
            </Pane>
          </Alert>
        )}
      </Pane>
    </Pane>
  );
}
