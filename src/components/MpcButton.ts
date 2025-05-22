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

            .container > button {
                border-radius: 4px;
                width: 60px;
                height: 23px;
            }

            .active-indicator {
                display: inline-block;
                border-radius: 50%;
                width: 13px;
                height: 13px;
                background-color: darkgreen;
                transition: background-color 0.2s
                    cubic-bezier(0.165, 0.84, 0.44, 1);

                margin: 6px 0;
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

    private get renderActiveIndicator() {
        if (this.active === undefined) {
            return html``;
        }

        const classes = classMap({
            "active-indicator": true,
            active: this.active,
        });

        return html` <p class=${classes}></p> `;
    }

    render() {
        return html`
            <div class="container">
                ${this.renderLabel} ${this.renderActiveIndicator}
                <button></button>
            </div>
        `;
    }
}
