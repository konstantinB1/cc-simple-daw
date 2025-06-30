import type { Constructor } from "@/utils/types";
import { css, LitElement } from "lit";

export const globalStyles = css`
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
`;

const WithGlobalStyles = <T extends Constructor<LitElement>>(superClass: T) => {
    class GlobalStyles extends superClass {
        static styles = [globalStyles];
    }

    return GlobalStyles as unknown as T & Constructor<GlobalStyles>;
};

export default WithGlobalStyles;
