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
            .container {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                background-color: var(--color-primary);
                color: var(--color-text);
                font-size: 16px;
                cursor: pointer;
            }

            .container > span {
                display: block;
                margin-bottom: 3px;
            }

            .btn {
                border-radius: 4px;
                border: 0;
                min-width: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                background-color: var(--color-primary);
                border: 1px solid transparent;
                height: 40px;
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
            <div class="container">
                <button
                    class=${classMap({
                        btn: true,
                        "active-indicator":
                            this.active !== undefined && this.active,
                    })}
                >
                    ${this.renderLabel}
                </button>
            </div>
        `;
    }
}
