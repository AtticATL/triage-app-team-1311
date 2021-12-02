import * as React from "react";
import { useState, useRef } from "react";
import { View, StyleSheet, TextInput as NativeTextInput } from "react-native";

// No types for this
// @ts-ignore
import { AutoGrowingTextInput } from "react-native-autogrow-textinput";

import { Text } from "./Themed";

import Container from "./Container";

export interface GroupProps {
  label?: string;
  caption?: string;
  children: React.ReactNode;
}

export function Group({ children, label, caption }: GroupProps) {
  return (
    <View style={styles.group}>
      {label && <Text style={styles.groupLabel}>{label.toUpperCase()}</Text>}
      <View style={styles.groupContents}>{children}</View>
      {caption && <Text style={styles.groupCaption}>{caption}</Text>}
    </View>
  );
}

export interface RowProps {
  // Left-side label
  left?: string;

  // row contents
  children: React.ReactNode;
}

export function Row({ left, children }: RowProps) {
  return (
    <View style={styles.row}>
      {left && <Text style={styles.rowLeft}>{left}</Text>}
      {children}
    </View>
  );
}

type AuxInputProps = Omit<
  React.ComponentProps<typeof NativeTextInput>,
  "value" | "ref"
>;

export interface InputProps<T> extends AuxInputProps {
  field: Field<T>;
  nextField?: Field<any>;

  parse: (input: string) => T;
  display: (value: T) => string;
}

export function inputProps<T>({
  field,
  nextField,
  parse,
  display,
  ...rest
}: InputProps<T>) {
  return {
    blurOnSubmit: typeof nextField === "undefined",
    returnKeyType:
      typeof nextField === "undefined" ? undefined : ("next" as "next"),
    onSubmitEditing: () => {
      if (typeof nextField !== "undefined" && nextField.ref.current != null) {
        nextField.ref.current.focus();
      }
    },
    style: styles.input,
    ...rest,
    onChangeText: (text: string) => {
      field.setValue(parse(text));
      if (typeof rest.onChangeText !== "undefined") {
        rest.onChangeText(text);
      }
    },
    value: display(field.value),
    ref: field.ref,
  };
}

export interface TypedInputProps<T> extends AuxInputProps {
  field: Field<T>;
  nextField?: Field<any>;
}

export function TextInput({ field, ...rest }: TypedInputProps<string>) {
  return (
    <NativeTextInput
      {...inputProps({
        field,
        parse: (s: string) => s,
        display: (v: string) => v,
        ...rest,
      })}
    />
  );
}

export function ParagraphInput({ field, ...rest }: TypedInputProps<string>) {
  const [height, setHeight] = useState(20);

  return (
    <AutoGrowingTextInput
      enableScrollToCaret={true}
      minHeight={100}
      textAlignVertical="top"
      {...inputProps({
        field,
        parse: (s: string) => s,
        display: (v: string) => v,
        blurOnSubmit: false,
        enablesReturnKeyAutomatically: true,
        onSubmitEditing: () => {},
        returnKeyType: undefined,
        ...rest,
      })}
    />
  );
}

export function NumberInput({
  field,
  ...rest
}: TypedInputProps<number | null>) {
  // Ignore NaNs and nulls
  let valueStr;

  return (
    <NativeTextInput
      {...inputProps({
        field,
        parse: (text: string) => parseFloat(text.replace(/[^0-9]/g, "")),
        display: (num: number | null) => {
          if (num == null || isNaN(num)) {
            return "";
          } else {
            return num.toString(); // stringify the number
          }
        },
        keyboardType: "numeric",
        ...rest,
      })}
    />
  );
}

// The state of a field: its value, a handle to update its value, and the reference to the text input element
export interface Field<T> {
  value: T;
  setValue: (newValue: T) => void;
  ref: React.RefObject<NativeTextInput>;
}

// Create a field
export function useField<T>(initial: T): Field<T> {
  const [value, setValue] = useState(initial);
  const ref = useRef(null);
  return { value, setValue, ref };
}

const insetMargin = 10;

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: insetMargin,
  },
  rowLeft: {
    width: 50,
    color: "#555",
    textAlign: "right",
    marginRight: 10,
  },

  input: {
    // paddingVertical doesn't work here because of a bug in react-native.
    paddingTop: insetMargin,
    paddingBottom: insetMargin,
    flex: 1,
  },

  group: {
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 12,
    marginBottom: 4,
    marginHorizontal: insetMargin,
    color: "#555",
  },
  groupCaption: {
    marginTop: 8,
    marginHorizontal: insetMargin,
    fontSize: 12,
    color: "#666",
  },
  groupContents: {
    backgroundColor: "white",
    borderRadius: 10,
  },
});
