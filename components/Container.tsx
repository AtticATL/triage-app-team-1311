import * as React from "react";

export interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div>
      <style jsx>{`
        div {
          position: relative;
          max-width: 800px;
          padding: 0 16px;
          margin: 0 auto;
        }
      `}</style>
      {children}
    </div>
  );
}
