import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typography } from "../global-styles";
import { classMap } from "lit/directives/class-map.js";

@customElement("mpc-button")
export default class MpcButton extends LitElement {
    @property({ type: Boolean, attribute: "active" })
    public active?: boolean = undefined;

    @property({ type: String })
    public label?: string = undefined;

    static styles = [
        typography,
        css`
            .btn {
                border-radius: 5px;
                border: 0;
                min-width: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                background-color: var(--color-primary);
                border: 1px solid transparent;
                height: 40px;
                cursor: pointer;
                transition: all 0.2s ease-in-out;

                &:hover {
                    transform: scale(0.98);
                    border-color: var(--color-tint-primary);
                }

                &:active {
                    transform: scale(0.95);
                }
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
        return html`
            <button
                class=${classMap({
                    btn: true,
                    "active-indicator":
                        this.active !== undefined && this.active,
                })}
            >
                ${this.renderLabel}
            </button>
        `;
    }
}
