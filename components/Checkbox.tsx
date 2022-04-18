import { emoryBlue } from "../colors";

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
      <span>{label}</span>

      <style jsx>{`
        label {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 2em;
          line-height: 2em;
          gap: 0.5em;
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
