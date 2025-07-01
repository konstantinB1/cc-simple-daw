import { css, LitElement } from "lit";
import StyleManager from "./utils/stylesheets";
import { consume } from "@lit/context";
import { stylesContext } from "./context/stylesContext";
import Color from "color";

const globalStyles = new CSSStyleSheet();

const basePrimary = Color("#aac7d2");

export const boxShadows = {
    elevated1: "0 1px 5px rgba(0, 0, 0, 0.4)",
    elevated2: "0 2px 10px rgba(0, 0, 0, 0.4)",
    elevated3: "0 4px 15px rgba(0, 0, 0, 0.4)",
};

export const layoutVars = {
    containerTopOffset: "15px",
};

export const themeVars = {
    colorPrimary: "#1d1d1d",
    colorSecondary: "#181818",
    colorAccent: "#363636",
    colorText: "#ffffff",
    colorBackground: "#222222",
    containerWidth: "1200px",
    cardColor: "#2c2c2c",
    colorTintPrimary: basePrimary.hex(),
    colorTintPrimaryActive: basePrimary.darken(1.1).hex(),
    colorTintDark: basePrimary.darken(0.2).hex(),
    borderRadius: "7px",
    navBgColor: "#595959",
    colorSuccess: "#5ace5e",
    colorError: "#f44336",
    colorWarning: "#ff9800",
    colorInfo: "#2196f3",
    colorBorder: "#333333",
    ...boxShadows,
    ...layoutVars,
};

export const colorClasses = css`
    .color-primary {
        color: var(--color-primary);
    }

    .color-secondary {
        color: var(--color-secondary);
    }

    .color-accent {
        color: var(--color-accent);
    }

    .color-text {
        color: var(--color-text);
    }

    .color-background {
        color: var(--color-background);
    }

    .color-success {
        color: var(--color-success);
    }

    .color-error {
        color: var(--color-error);
    }

    .color-main {
        color: var(--color-tint-primary);
    }
`;

export const litStyles = css`
    .overflow-hidden {
        overflow: hidden;
    }

    .scroll {
        overflow: auto;
    }

    .block {
        display: block;
    }

    .inline {
        display: inline;
    }

    .inline-block {
        display: inline-block;
    }

    .hidden {
        display: none;
    }

    .visible {
        display: block;
    }

    .flex {
        display: flex;
    }

    .flex-column {
        flex-direction: column;
    }

    .flex-row {
        flex-direction: row;
    }

    .flex-wrap {
        flex-wrap: wrap;
    }

    .flex-nowrap {
        flex-wrap: nowrap;
    }

    .flex-center {
        justify-content: center;
        align-items: center;
    }

    .flex-start {
        justify-content: flex-start;
        align-items: flex-start;
    }

    .flex-end {
        justify-content: flex-end;
        align-items: flex-end;
    }

    .flex-space-between {
        justify-content: space-between;
        align-items: center;
    }

    .flex-space-around {
        justify-content: space-around;
        align-items: center;
    }

    .flex-space-evenly {
        justify-content: space-evenly;
        align-items: center;
    }

    .cursor-pointer {
        cursor: pointer;
    }

    .cursor-default {
        cursor: default;
    }

    .fixed {
        position: fixed;
    }

    .absolute {
        position: absolute;
    }

    .relative {
        position: relative;
    }

    .sticky {
        position: sticky;
    }

    .full-space {
        width: 100%;
        height: 100%;
    }

    .full-width {
        width: 100%;
    }

    .full-height {
        height: 100%;
    }

    .top {
        top: 0;
    }

    .bottom {
        bottom: 0;
    }

    .left {
        left: 0;
    }

    .right {
        right: 0;
    }

    .z-backdrop {
        z-index: var(--z-index-backdrop);
    }

    .z-modal {
        z-index: var(--z-index-modal);
    }

    .z-tooltip {
        z-index: var(--z-index-tooltip);
    }

    .typography-100 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 100;
        font-style: normal;
    }

    .typography-200 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 200;
        font-style: normal;
    }

    .typography-300 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 300;
        font-style: normal;
    }

    .typography-400 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }

    .typography-500 {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 500;
        font-style: normal;
    }

    .color-primary {
        color: var(--color-primary);
    }

    .color-secondary {
        color: var(--color-secondary);
    }

    .color-accent {
        color: var(--color-accent);
    }

    .color-text {
        color: var(--color-text);
    }

    .color-background {
        color: var(--color-background);
    }

    .color-success {
        color: var(--color-success);
    }

    .color-error {
        color: var(--color-error);
    }

    .bg-primary {
        background-color: var(--color-primary);
    }

    .bg-secondary {
        background-color: var(--color-secondary);
    }

    .bg-accent {
        background-color: var(--color-accent);
    }

    .bg-text {
        background-color: var(--color-text);
    }

    .bg-background {
        background-color: var(--color-background);
    }

    .bg-success {
        background-color: var(--color-success);
    }

    .bg-error {
        background-color: var(--color-error);
    }

    .radius-normal {
        border-radius: var(--border-radius);
    }

    .border-primary {
        border: 1px solid var(--color-primary);
    }
`;

export function globalToString() {
    return litStyles.cssText + colorClasses.cssText;
}

export function WithStyles<T extends new (...args: any[]) => LitElement>(
    Base: T,
) {
    class StylesConsumer extends Base {
        @consume({ context: stylesContext, subscribe: true })
        styleManager!: StyleManager<typeof themeVars>;

        connectedCallback() {
            super.connectedCallback();

            if (this.shadowRoot) {
                this.shadowRoot.adoptedStyleSheets = [
                    ...this.shadowRoot.adoptedStyleSheets,
                    globalStyles,
                ];
            }
        }
    }

    return StylesConsumer as unknown as T & {
        new (
            ...args: any[]
        ): LitElement & { styleManager: StyleManager<typeof themeVars> };
    };
}
