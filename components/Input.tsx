import * as React from "react";
import { dark, outline } from "../colors";

export interface InputProps {
  value: string;
  onChange: (value: string) => unknown;
  onBlur: () => unknown;
  type: React.HTMLProps<HTMLInputElement>["type"];
  inputMode?: React.HTMLProps<HTMLInputElement>["inputMode"];
}

export default function Input({
  value,
  onChange,
  onBlur,
  type,
  inputMode,
}: InputProps) {
  return (
    <>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur()}
        value={value}
        inputMode={inputMode}
      />
      <style jsx>
        {`
          input {
            font-size: inherit;
            font-family: inherit;
            border: none;
            border-bottom: 1px solid ${outline};
            padding: 4px 0;
            border-radius: 0;
          }

          input:focus {
            outline: none;
            border: none;
            border-bottom: 1px solid ${dark};
          }
        `}
      </style>
    </>
  );
}
