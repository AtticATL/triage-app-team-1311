import { useRouter } from "next/router";
import css from "styled-jsx/css";
import * as React from "react";
import { FiChevronLeft } from "react-icons/fi";
import Container from "./Container";
import { StackingOrder } from "evergreen-ui";
import { outline } from "../colors";

export interface NavBarProps {
  title: string;
}

export default function NavBar({ title }: NavBarProps) {
  const router = useRouter();

  const canGoBack = process.browser && window.history.length > 1;

  return (
    <div className="spacer">
      <nav className="bar">
        <Container>
          <div className="bar-inner">
            <button
              onClick={() => router.back()}
              className="back"
              suppressHydrationWarning={true}
              style={{ display: canGoBack ? "flex" : "none" }}
            >
              <FiChevronLeft size={20} />
              BACK
            </button>
            <div className="title">{title}</div>
          </div>
        </Container>
      </nav>

      <style jsx>{`
        .spacer {
          position: relative;
          height: var(--height);

          --height: 40px;
        }

        .bar {
          z-index: ${StackingOrder.OVERLAY - 1};
          position: fixed;
          width: 100%;
          height: var(--height);
          top: 0;
          left: 0;

          background-color: white;
          border-bottom: 1px solid ${outline};
        }

        .bar-inner {
          position: relative;
          height: var(--height);
          flex: 1;
          display: flex;
          align-items: center;
        }

        .back {
          color: black;
          appearance: none;
          background: none;
          border: none;

          position: absolute;
          left: 0;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .title {
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
