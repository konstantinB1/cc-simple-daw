import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import type { TextVariant } from "./Text";

@customElement("mpc-button")
export default class MpcButton extends LitElement {
    @property({ type: Boolean, attribute: "active" })
    public active?: boolean = undefined;

    @property({ type: String })
    public label?: string = undefined;

    @property({ type: String })
    public size: "small" | "medium" | "large" = "medium";

    private get sizeClass() {
        switch (this.size) {
            case "small":
                return "btn-small";
            case "medium":
                return "btn-medium";
            case "large":
                return "btn-large";
            default:
                return "";
        }
    }

    static styles = [
        css`
            .btn {
                border-radius: 5px;
                border: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                height: 40px;
                background-color: var(--color-primary);
                border: 1px solid transparent;
                cursor: pointer;

                &:hover {
                    transform: scale(0.99);
                    border-color: var(--color-tint-primary);
                }

                &:active {
                    transform: scale(0.95);
                }
            }

            .btn-small {
                padding: 5px 10px;
                font-size: 0.8em;
            }

            .btn-medium {
                padding: 10px 15px;
                font-size: 1em;
            }

            .btn-large {
                padding: 15px 20px;
                font-size: 1.2em;
            }

            .active-indicator {
                border: 1px solid var(--color-tint-primary);
            }

            .label {
                font-size: 1em;
                color: var(--color-text);
            }

            .active-indicator.active {
                background-color: green;
            }
        `,
    ];

    private get renderLabel() {
        if (this.label) {
            return html`<span class="label typography-200"
                >${this.label}</span
            >`;
        }

        return html``;
    }

    render() {
        const classes = classMap({
            btn: true,
            [this.sizeClass]: true,
            "active-indicator": this.active !== undefined && this.active,
        });

        let labelVariant: TextVariant = "body2";

        switch (this.size) {
            case "small":
                labelVariant = "tiny";
                break;
            case "medium":
                labelVariant = "body2";
                break;
            case "large":
                labelVariant = "body1";
                break;
        }

        return html`
            <button class=${classes}>
                <slot name="before-label"></slot>
                <text-element .variant=${labelVariant}>
                    ${this.renderLabel}
                </text-element>
                <slot name="after-label"></slot>
            </button>
        `;
    }
}
