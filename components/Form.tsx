import * as React from "react";
import { useState, useRef, useCallback } from "react";
import { ZodType, z, ZodIssue, ZodEnum, ZodNumber } from "zod";
import {
  Box,
  FormControl,
  Input,
  VStack,
  Text,
  HStack,
  useColorModeValue,
  Button,
  TextArea,
  useToken,
  Checkbox as NbCheckbox,
} from "native-base";
import { Feather } from "@expo/vector-icons";

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

  /** A React component ref to the input element */
  ref: React.RefObject<Focusable>;
}

/** Any React element that can receive focus */
export interface Focusable {
  /** Move input focus to this element. */
  focus(): void;
}

/** Track the contents of a field in React state */
export function useField<Z extends ZodType<any>>(validator: Z): Field<Z> {
  const [value, setValue] = useState<z.infer<Z> | undefined>(undefined);
  const ref = useRef(null);
  return { validator, value, setValue, ref };
}

export interface FieldProps<Z extends ZodType<any>> {
  field: Field<Z>;
  nextField?: Field<any>;
  label: string;
  help?: string;
}

export function TextField<Z extends ZodType<string | undefined>>({
  field,
  nextField,
  label,
  help,
  ...rest
}: FieldProps<Z> & React.ComponentProps<typeof Input>) {
  // Track whether the user has submitted this field before
  let [dirty, setDirty] = useState(false);
  let clean = !dirty && field.value === "";

  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  return (
    <Entry>
      <Label>{label}</Label>
      <Input
        size="md"
        variant="unstyled"
        {...rest}
        value={field.value || ""}
        onChangeText={field.setValue}
        onSubmitEditing={() => {
          if (nextField && nextField.ref.current) {
            nextField.ref.current.focus();
          }
        }}
        onBlur={() => {
          setDirty(true);

          // Remove whitespace around, and null out of empty.
          let trimmed = field.value && field.value.trim();
          let nulled = trimmed || undefined;
          field.setValue(nulled);
        }}
        blurOnSubmit={!(nextField && nextField.ref.current)}
        ref={field.ref}
      />
      {dirty &&
        issues.map((issue, i) => <Error key={i}>{issue.message}</Error>)}
      {help && <HelpText>{help}</HelpText>}
    </Entry>
  );
}

export function EnumField<Z extends ZodEnum<any>>({
  field,
  nextField,
  label,
  help,
  ...rest
}: FieldProps<Z>) {
  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  return (
    <Entry>
      <Label>{label}</Label>
      <Button.Group mx={2} my={2}>
        {field.validator.options.map((option: string) => (
          <Button
            key={option}
            colorScheme="light"
            variant={field.value == option ? "solid" : "unstyled"}
            onPress={() => field.setValue(option)}
          >
            {option}
          </Button>
        ))}
      </Button.Group>
      {field.value != undefined &&
        issues.map((issue) => <Error>{issue.message}</Error>)}
      {help && <HelpText>{help}</HelpText>}
    </Entry>
  );
}

export function NumberField<Z extends ZodNumber>({
  field,
  nextField,
  label,
  help,
  ...rest
}: FieldProps<Z> & React.ComponentProps<typeof Input>) {
  // Track the string representation of the number for editing
  let [text, setText] = useState("");

  // Track whether the user has submitted this field before
  let [dirty, setDirty] = useState(false);
  let clean = !dirty && text === "";

  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  const onChange = useCallback((value: string) => {
    // Always update the local value.
    setText(value);

    // If the text is parseable as a number, update the field value.
    let maybeParsed = parseFloat(value);
    if (!isNaN(maybeParsed)) {
      field.setValue(maybeParsed);
    } else {
      field.setValue(undefined);
    }
  }, []);

  return (
    <Entry>
      <Label>{label}</Label>
      <Input
        size="md"
        variant="unstyled"
        {...rest}
        value={text}
        onChangeText={onChange}
        onSubmitEditing={() => {
          setDirty(true);
          if (nextField && nextField.ref.current) {
            nextField.ref.current.focus();
          }
        }}
        onBlur={() => setDirty(true)}
        keyboardType={field.validator.isInt ? "number-pad" : "decimal-pad"}
        blurOnSubmit={!(nextField && nextField.ref.current)}
        ref={field.ref}
      />
      {dirty &&
        issues.map((issue, i) => <Error key={i}>{issue.message}</Error>)}
      {help && <HelpText>{help}</HelpText>}
    </Entry>
  );
}

export function ParagraphField<Z extends ZodType<string | undefined>>({
  field,
  nextField,
  label,
  help,
  ...rest
}: FieldProps<Z> & React.ComponentProps<typeof Input>) {
  // Track whether the user has submitted this field before
  let [dirty, setDirty] = useState(false);
  let clean = !dirty && field.value === "";

  // Track input validation problems.
  let zodResult = field.validator.safeParse(field.value);
  let issues = zodResult.success ? [] : zodResult.error.issues;

  return (
    <Entry>
      <Label>{label}</Label>
      {help && <HelpText>{help}</HelpText>}
      <Input
        size="md"
        variant="unstyled"
        {...rest}
        value={field.value || ""}
        onChangeText={field.setValue}
        multiline
        textAlignVertical="top"
        minHeight={useToken("space", 8)}
        onBlur={() => {
          setDirty(true);

          // Remove whitespace around, and null out of empty.
          let trimmed = field.value && field.value.trim();
          let nulled = trimmed || undefined;
          field.setValue(nulled);
        }}
        blurOnSubmit={!(nextField && nextField.ref.current)}
        ref={field.ref}
      />
      {dirty &&
        issues.map((issue, i) => <Error key={i}>{issue.message}</Error>)}
    </Entry>
  );
}

export interface CheckboxProps {
  label: string;
  help?: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export function Checkbox({ label, help, value, onChange }: CheckboxProps) {
  return (
    <Entry px={2}>
      <NbCheckbox
        size="md"
        value={value.toString()}
        onChange={onChange}
        colorScheme="muted"
      >
        <Text pl={4}>{label}</Text>
        {help && <HelpText>{help}</HelpText>}
      </NbCheckbox>
    </Entry>
  );
}

/** Group surrounding an input, its label, helper text, and any validation errors. */
export function Entry({
  children,
  ...rest
}: { children: React.ReactNode } & React.ComponentProps<typeof VStack>) {
  return (
    <VStack
      bg={useColorModeValue("white", "muted.800")}
      rounded="md"
      px={1}
      py={2}
      {...rest}
    >
      {children}
    </VStack>
  );
}

/** The name of an input. */
function Label({ children }: { children: string }) {
  return (
    <Text fontWeight="bold" mx={2}>
      {children}
    </Text>
  );
}

/** Render explanatory help text for the input */
function HelpText({ children }: { children: string }) {
  return (
    <Text mx={2} color="muted.500">
      {children}
    </Text>
  );
}

function Error({ children }: { children: string }) {
  return (
    <HStack alignItems="flex-start" mx={2}>
      <Box alignSelf="flex-start" justifyContent="center" h={5}>
        <Feather name="alert-circle" color="red" />
      </Box>
      <Text px={2} color="error.600">
        {children}
      </Text>
    </HStack>
  );
}
