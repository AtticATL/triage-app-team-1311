import TextareaAutosize from "react-textarea-autosize";
import { outline } from "../colors";

export interface TextareaProps {
  value: string;
  onChange: (value: string) => unknown;
  onBlur: () => unknown;
}

export default function Textarea({ value, onChange, onBlur }: TextareaProps) {
  return (
    <div>
      <style jsx>{`
        div {
          display: flex;
          flex: 1;
        }

        div :global(textarea) {
          flex: 1;
          border: none;
          font-family: inherit;
          font-size: inherit;
          border-bottom: 1px solid ${outline};
          border-radius: 0;
          resize: none;
          padding: 4px 0;
        }

        div :global(textarea):focus {
          outline: none;
          border-bottom: 1px solid black;
        }
      `}</style>
      <TextareaAutosize
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onBlur()}
        minRows={3}
      />
    </div>
  );
}
