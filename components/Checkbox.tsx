import { emoryBlue } from "../colors";
import { Text } from "evergreen-ui";

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => unknown;
}

export default function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Text>{label}</Text>

      <style jsx>{`
        label {
          user-select: none;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 2em;
          gap: 0.5em;
          margin-bottom: 0.5em;
          accent-color: ${emoryBlue};
        }

        input {
          width: 1.5em;
          height: 1.5em;
        }
      `}</style>
    </label>
  );
}
