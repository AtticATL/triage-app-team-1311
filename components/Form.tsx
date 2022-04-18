import * as React from "react";
import { useState, useRef, useCallback, useMemo } from "react";
import { ZodType, z, ZodIssue, ZodEnum, ZodNumber } from "zod";
import { FiAlertCircle } from "react-icons/fi";
import { Text, Pane, Button } from "evergreen-ui";
import { danger, muted } from "../colors";
import Input from "./Input";
import Textarea from "./Textarea";

/** Data tracking the correct value of a field, ignoring any incorrect data.  */
export interface Field<Z extends ZodType<any>> {
  /**
   * Zod type validator for the contents of this field.
   */
  validator: Z;

  /** The current value of the field. Can be undefined */
  value: z.infer<Z> | undefined;

  /** A function to update the current value of the field, wherever it's stored */
  setValue: (value: z.infer<Z> | undefined) => void;
}

/** Track the contents of a field in React state */
export function useField<Z extends ZodType<any>>(
  validator: Z,
  def?: z.infer<Z>
): Field<Z> {
  const [value, setValue] = useState<z.infer<Z> | undefined>(def);

  return useMemo(
    () => ({
      validator,
      value,
      setValue,
    }),
    [validator, value, setValue]
  );
}

export interface FieldProps<Z extends ZodType<any>> {
  field: Field<Z>;
  label: string;
  help?: string;
}

export function TextField<Z extends ZodType<string | undefined>>({
  field,
  label,
  help,
  ...rest
}: FieldProps<Z>) {
  // Track whether the user has submitted this field before
  let [dirty, setDirty] = useState(false);
  let clean = !dirty && field.value === "";

  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  return (
    <Entry>
      <Label label={label}>
        <Input
          type="text"
          value={field.value || ""}
          onChange={field.setValue}
          onBlur={() => {
            setDirty(true);

            // Remove whitespace around, and null out of empty.
            let trimmed = field.value && field.value.trim();
            let nulled = trimmed || undefined;
            field.setValue(nulled);
          }}
        />
        {dirty &&
          issues.map((issue, i) => <Error key={i}>{issue.message}</Error>)}
        {help && <HelpText>{help}</HelpText>}
      </Label>
    </Entry>
  );
}

export function EnumField<Z extends ZodEnum<any>>({
  field,
  label,
  help,
  ...rest
}: FieldProps<Z>) {
  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  return (
    <Entry>
      <Label label={label} />
      <Pane>
        {field.validator.options.map((option: string) => (
          <Button
            key={option}
            appearance={field.value == option ? "primary" : "minimal"}
            onClick={() => field.setValue(option)}
          >
            {option}
          </Button>
        ))}
      </Pane>
      {field.value != undefined &&
        issues.map((issue, i) => <Error key={i}>{issue.message}</Error>)}
      {help && <HelpText>{help}</HelpText>}
    </Entry>
  );
}

export function NumberField<Z extends ZodNumber>({
  field,
  label,
  help,
  ...rest
}: FieldProps<Z>) {
  // Track the string representation of the number for editing
  let [text, setText] = useState(field.value?.toString());

  // Track whether the user has submitted this field before
  let [dirty, setDirty] = useState(false);
  let clean = !dirty && text === "";

  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  const onChange = useCallback(
    (value: string) => {
      setText(value);

      // If the text is parseable as a number, update the field value.
      let maybeParsed = Number(value);
      if (!isNaN(maybeParsed)) {
        field.setValue(maybeParsed);
      } else {
        field.setValue(undefined);
      }
    },
    [setText, field]
  );

  return (
    <Entry>
      <Label label={label}>
        <Input
          type="text"
          {...rest}
          value={text || ""}
          onChange={onChange}
          onBlur={() => setDirty(true)}
          inputMode={field.validator.isInt ? "numeric" : "decimal"}
        />
        {dirty &&
          issues.map((issue, i) => <Error key={i}>{issue.message}</Error>)}
        {help && <HelpText>{help}</HelpText>}
      </Label>
    </Entry>
  );
}

export function ParagraphField<Z extends ZodType<string | undefined>>({
  field,
  label,
  help,
  ...rest
}: FieldProps<Z>) {
  // Track whether the user has submitted this field before
  let [dirty, setDirty] = useState(false);
  let clean = !dirty && field.value === "";

  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  return (
    <Entry>
      <Label label={label}>
        <Textarea
          value={field.value || ""}
          onChange={field.setValue}
          onBlur={() => {
            setDirty(true);

            // Remove whitespace around, and null out of empty.
            let trimmed = field.value && field.value.trim();
            let nulled = trimmed || undefined;
            field.setValue(nulled);
          }}
        />
        {help && <HelpText>{help}</HelpText>}
        {dirty &&
          issues.map((issue, i) => <Error key={i}>{issue.message}</Error>)}
      </Label>
    </Entry>
  );
}

export function Entry({
  children,
  gap,
}: {
  children: React.ReactNode;
  gap?: number;
}) {
  return (
    <Pane
      backgroundColor="white"
      borderRadius={8}
      paddingX={8}
      paddingY={8}
      display="flex"
      flexDirection="column"
      gap={gap || 8}
    >
      {children}
    </Pane>
  );
}

function Label({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <label>
      <style jsx>{`
        label {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      `}</style>
      <Text fontWeight="bold" marginX={2}>
        {label}
      </Text>
      {children}
    </label>
  );
}

function HelpText({ children }: { children: string }) {
  return (
    <Text marginX={2} color={muted}>
      {children}
    </Text>
  );
}

function Error({ children }: { children: string }) {
  return (
    <Pane display="flex" flexDirection="row" alignItems="center" gap={8}>
      <Pane alignSelf="flex-start" justifyContent="center">
        <FiAlertCircle color={danger} />
      </Pane>
      <Text paddingX={2} color={danger}>
        {children}
      </Text>
    </Pane>
  );
}
