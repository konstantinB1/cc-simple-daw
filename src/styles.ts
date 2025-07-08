import { css } from "lit";
import Color from "color";

const globalStyles = new CSSStyleSheet();

const basePrimary = Color("#aac7d2");

export const boxShadows = {
    elevated1: "0 1px 5px rgba(0, 0, 0, 0.4)",
    elevated2: "0 2px 10px rgba(0, 0, 0, 0.4)",
    elevated3: "0 4px 15px rgba(0, 0, 0, 0.4)",
    navbar: "0 1px 5px rgba(0, 0, 0, 0.5)",
};

export const layoutVars = {
    containerTopOffset: "15px",
    xMargin: "16px",
    p1: "4px",
    p2: "8px",
    p3: "12px",
    p4: "16px",
    p5: "20px",
    p6: "24px",
    pl1: "4px",
    pl2: "8px",
    pl3: "12px",
    pl4: "16px",
    pl5: "20px",
    pl6: "24px",
    pr1: "4px",
    pr2: "8px",
    pr3: "12px",
    pr4: "16px",
    pr5: "20px",
    pr6: "24px",
    pt1: "4px",
    pt2: "8px",
    pt3: "12px",
    pt4: "16px",
    pt5: "20px",
    pt6: "24px",
    pb1: "4px",
    pb2: "8px",
    pb3: "12px",
    pb4: "16px",
    pb5: "20px",
    pb6: "24px",
    m1: "4px",
    m2: "8px",
    m3: "12px",
    m4: "16px",
    m5: "20px",
    m6: "24px",
    ml1: "4px",
    ml2: "8px",
    ml3: "12px",
    ml4: "16px",
    ml5: "20px",
    ml6: "24px",
    mr1: "4px",
    mr2: "8px",
    mr3: "12px",
    mr4: "16px",
    mr5: "20px",
    mr6: "24px",
    mt1: "4px",
    mt2: "8px",
    mt3: "12px",
    mt4: "16px",
    mt5: "20px",
    mt6: "24px",
    mb1: "4px",
    mb2: "8px",
    mb3: "12px",
    mb4: "16px",
    mb5: "20px",
    mb6: "24px",
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

export const gaps = css`
    .gap-0 {
        gap: 0px;
    }

    .gap-1 {
        gap: 4px;
    }

    .gap-2 {
        gap: 8px;
    }

    .gap-3 {
        gap: 12px;
    }

    .gap-4 {
        gap: 16px;
    }

    .gap-5 {
        gap: 20px;
    }
`;

export const spacing = css`
    .x-margin {
        margin-left: var(--x-margin);
        margin-right: var(--x-margin);
    }
`;

export const litStyles = css`
    .clickable {
        cursor: pointer;
        transition: opacity 0.4s ease-in-out;
    }

    .clickable:hover {
        opacity: 0.8;
    }

    .bbox {
        box-sizing: border-box;
    }

    .overflow-hidden {
        overflow: hidden;
    }

    .scroll {
        overflow: auto;
    }

    .text-elipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
        align-items: center;
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

    .bg-card {
        background-color: var(--card-color);
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

    .bg-hover-primary:hover {
        background-color: var(--color-primary);
    }

    .bg-hover-secondary:hover {
        background-color: var(--color-secondary);
    }

    .bg-hover-accent:hover {
        background-color: var(--color-accent);
    }

    .bg-hover-text:hover {
        background-color: var(--color-text);
    }

    .bg-hover-background:hover {
        background-color: var(--color-background);
    }

    .bg-hover-success:hover {
        background-color: var(--color-success);
    }

    .radius-normal {
        border-radius: var(--border-radius);
    }

    .border-primary {
        border: 1px solid var(--color-primary);
    }

    .border-secondary {
        border: 1px solid var(--color-secondary);
    }

    .border-accent {
        border: 1px solid var(--color-accent);
    }

    .border-text {
        border: 1px solid var(--color-text);
    }

    .border-background {
        border: 1px solid var(--color-background);
    }

    .border-success {
        border: 1px solid var(--color-success);
    }

    .border-error {
        border: 1px solid var(--color-error);
    }

    .border-bottom-primary {
        border-bottom: 1px solid var(--color-primary);
    }

    .border-bottom-secondary {
        border-bottom: 1px solid var(--color-secondary);
    }

    .border-bottom-accent {
        border-bottom: 1px solid var(--color-accent);
    }

    .border-bottom-text {
        border-bottom: 1px solid var(--color-text);
    }

    .border-bottom-background {
        border-bottom: 1px solid var(--color-background);
    }

    .elevated-1 {
        box-shadow: var(--box-shadow-elevated1);
    }

    .elevated-2 {
        box-shadow: var(--box-shadow-elevated2);
    }

    .elevated-3 {
        box-shadow: var(--box-shadow-elevated3);
    }

    .elevated-navbar {
        box-shadow: var(--box-shadow-navbar);
    }

    .p-1 {
        padding: var(--p-1);
    }
    .p-2 {
        padding: var(--p-2);
    }
    .p-3 {
        padding: var(--p-3);
    }
    .p-4 {
        padding: var(--p-4);
    }
    .p-5 {
        padding: var(--p-5);
    }
    .p-6 {
        padding: var(--p-6);
    }
    .pl-1 {
        padding-left: var(--p-1);
    }
    .pl-2 {
        padding-left: var(--p-2);
    }
    .pl-3 {
        padding-left: var(--p-3);
    }
    .pl-4 {
        padding-left: var(--p-4);
    }
    .pl-5 {
        padding-left: var(--p-5);
    }
    .pl-6 {
        padding-left: var(--p-6);
    }
    .pr-1 {
        padding-right: var(--p-1);
    }
    .pr-2 {
        padding-right: var(--p-2);
    }
    .pr-3 {
        padding-right: var(--p-3);
    }
    .pr-4 {
        padding-right: var(--p-4);
    }
    .pr-5 {
        padding-right: var(--p-5);
    }
    .pr-6 {
        padding-right: var(--p-6);
    }
    .pt-1 {
        padding-top: var(--p-1);
    }
    .pt-2 {
        padding-top: var(--p-2);
    }
    .pt-3 {
        padding-top: var(--p-3);
    }
    .pt-4 {
        padding-top: var(--p-4);
    }
    .pt-5 {
        padding-top: var(--p-5);
    }
    .pt-6 {
        padding-top: var(--p-6);
    }
    .pb-1 {
        padding-bottom: var(--p-1);
    }
    .pb-2 {
        padding-bottom: var(--p-2);
    }
    .pb-3 {
        padding-bottom: var(--p-3);
    }
    .pb-4 {
        padding-bottom: var(--p-4);
    }
    .pb-5 {
        padding-bottom: var(--p-5);
    }
    .pb-6 {
        padding-bottom: var(--p-6);
    }
    .m-1 {
        margin: var(--m-1);
    }
    .m-2 {
        margin: var(--m-2);
    }
    .m-3 {
        margin: var(--m-3);
    }
    .m-4 {
        margin: var(--m-4);
    }
    .m-5 {
        margin: var(--m-5);
    }
    .m-6 {
        margin: var(--m-6);
    }
    .ml-1 {
        margin-left: var(--m-1);
    }
    .ml-2 {
        margin-left: var(--m-2);
    }
    .ml-3 {
        margin-left: var(--m-3);
    }
    .ml-4 {
        margin-left: var(--m-4);
    }
    .ml-5 {
        margin-left: var(--m-5);
    }
    .ml-6 {
        margin-left: var(--m-6);
    }
    .mr-1 {
        margin-right: var(--m-1);
    }
    .mr-2 {
        margin-right: var(--m-2);
    }
    .mr-3 {
        margin-right: var(--m-3);
    }
    .mr-4 {
        margin-right: var(--m-4);
    }
    .mr-5 {
        margin-right: var(--m-5);
    }
    .mr-6 {
        margin-right: var(--m-6);
    }
    .mt-1 {
        margin-top: var(--m-1);
    }
    .mt-2 {
        margin-top: var(--m-2);
    }
    .mt-3 {
        margin-top: var(--m-3);
    }
    .mt-4 {
        margin-top: var(--m-4);
    }
    .mt-5 {
        margin-top: var(--m-5);
    }
    .mt-6 {
        margin-top: var(--m-6);
    }
    .mb-1 {
        margin-bottom: var(--m-1);
    }
    .mb-2 {
        margin-bottom: var(--m-2);
    }
    .mb-3 {
        margin-bottom: var(--m-3);
    }
    .mb-4 {
        margin-bottom: var(--m-4);
    }
    .mb-5 {
        margin-bottom: var(--m-5);
    }
    .mb-6 {
        margin-bottom: var(--m-6);
    }
    .mx-1 {
        margin-left: var(--m-1);
        margin-right: var(--m-1);
    }
    .mx-2 {
        margin-left: var(--m-2);
        margin-right: var(--m-2);
    }
    .mx-3 {
        margin-left: var(--m-3);
        margin-right: var(--m-3);
    }
    .mx-4 {
        margin-left: var(--m-4);
        margin-right: var(--m-4);
    }
    .mx-5 {
        margin-left: var(--m-5);
        margin-right: var(--m-5);
    }
    .mx-6 {
        margin-left: var(--m-6);
        margin-right: var(--m-6);
    }
    .my-1 {
        margin-top: var(--m-1);
        margin-bottom: var(--m-1);
    }
    .my-2 {
        margin-top: var(--m-2);
        margin-bottom: var(--m-2);
    }
    .my-3 {
        margin-top: var(--m-3);
        margin-bottom: var(--m-3);
    }
    .my-4 {
        margin-top: var(--m-4);
        margin-bottom: var(--m-4);
    }
    .my-5 {
        margin-top: var(--m-5);
        margin-bottom: var(--m-5);
    }
    .my-6 {
        margin-top: var(--m-6);
        margin-bottom: var(--m-6);
    }
`;

export const helperStyles = css`
    ${gaps}
    ${litStyles}
    ${spacing},
`;

export function globalToString() {
    return litStyles.cssText + colorClasses.cssText;
}

export function createGlobalStylesheet() {
    const stylesText = helperStyles.cssText;
    const styleElement = document.createElement("style");
    const id = `global-styles-ONCE`;

    if (!document.getElementById(id)) {
        styleElement.id = id;
        styleElement.textContent = stylesText;
        document.head.appendChild(styleElement);
    }

    globalStyles.replaceSync(stylesText);
}
