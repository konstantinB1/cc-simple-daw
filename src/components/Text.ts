import { colorClasses } from "@/styles";
import { css, LitElement } from "lit";
import type { DirectiveResult } from "lit/async-directive.js";
import { customElement, property } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

@customElement("text-element")
export default class Text extends LitElement {
    @property({ type: String })
    weight: "100" | "200" | "300" | "400" | "500" = "300";

    @property({ type: String })
    variant:
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "body1"
        | "body2"
        | "tiny"
        | "caption"
        | "mono" = "body1";

    @property({ type: String })
    color:
        | "main"
        | "primary"
        | "secondary"
        | "accent"
        | "text"
        | "success"
        | "error" = "text";

    @property({ type: String })
    size!: "xs" | "sm" | "md" | "lg" | "xl";

    @property({ type: String })
    spacing: "none" | "small" | "medium" | "large" = "small";

    @property({ type: Boolean, attribute: "overflow" })
    overflow: boolean = false;

    static styles = [
        colorClasses,
        css`
            p,
            h1,
            h2,
            h3,
            h4,
            h5,
            span {
                margin: 0;
                padding: 0;
            }

            .variatnt-h1 {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
                font-size: 2rem; /* 32px */
            }

            .variant-h2 {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
                font-size: 1.5rem; /* 24px */
            }

            .variant-h3 {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
                font-size: 1.25rem; /* 20px */
            }

            .variant-h4 {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
                font-size: 1.125rem; /* 18px */
            }

            .variant-h5 {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 500;
                font-style: normal;
                font-size: 1rem; /* 16px */
            }

            .variant-body1 {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 400;
                font-style: normal;
                font-size: 0.8em; /* 14px */
            }

            .variant-body2 {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 400;
                font-style: normal;
                font-size: 0.75rem; /* 12px */
            }

            .variant-tiny {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                font-weight: 400;
                font-style: normal;
                font-size: 0.75rem; /* 12px */
            }

            .variant-caption {
                font-family: "Montserrat", sans-serif;
                font-optical-sizing: auto;
                text-transform: uppercase;
                font-weight: 400;
                font-style: normal;
                font-size: 0.75rem; /* 12px */
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

            .size-xs {
                font-size: 0.75rem; /* 12px */
            }

            .size-sm {
                font-size: 0.875rem; /* 14px */
            }

            .size-md {
                font-size: 1rem; /* 16px */
            }

            .size-lg {
                font-size: 1.125rem; /* 18px */
            }

            .size-xl {
                font-size: 1.25rem; /* 20px */
            }

            .spacing-none {
                letter-spacing: 0;
            }

            .spacing-small {
                letter-spacing: 0.05em; /* 0.05em */
            }

            .spacing-medium {
                letter-spacing: 0.1em; /* 0.1em */
            }

            .spacing-large {
                letter-spacing: 0.15em; /* 0.15em */
            }

            .variant-mono {
                font-family: "Roboto Mono", monospace;
                font-optical-sizing: auto;
                font-weight: 200;
                font-style: normal;
                letter-spacing: 0.1em; /* 0.025em */
            }

            .overflow {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `,
    ];

    private get resolveVariantTag(): DirectiveResult {
        let tag = "";

        switch (this.variant) {
            case "h1":
                tag = "h1";
                break;
            case "h2":
                tag = "h2";
                break;
            case "h3":
                tag = "h3";
                break;
            case "h4":
                tag = "h4";
                break;
            case "h5":
                tag = "h5";
                break;
            case "body1":
                tag = "p";
                break;
            case "body2":
                tag = "p";
                break;
            case "caption":
                tag = "span";
                break;
            default:
                tag = "p";
                break;
        }

        const classes = [
            `typography-${this.weight}`,
            `variant-${this.variant}`,
            `color-${this.color}`,
            `size-${this.size ?? ""}`,
            `spacing-${this.spacing}`,
            this.overflow ? "overflow" : "",
        ]
            .filter(Boolean)
            .join(" ");

        return unsafeHTML(`<${tag} class="${classes}"><slot></slot></${tag}>`);
    }

    render() {
        return this.resolveVariantTag;
    }
}
