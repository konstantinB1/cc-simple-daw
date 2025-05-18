import { css, html, LitElement, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typography } from "../global-styles";
import { classMap } from "lit/directives/class-map.js";

const name = "daw-pad";

@customElement("daw-pad")
class Pad extends LitElement {
    @property({ type: String, attribute: "key-binding" })
    keyBinding: string = "";

    @property({ type: Boolean })
    isPressed: boolean = false;

    @property({ type: String })
    name?: string = "Empty pad";

    static styles: CSSResultGroup = [
        typography,
        css`
            .pad {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 3px;
                border: 0;
                background-color: var(--color-accent);
                width: 100px;
                height: 70px;
                transition: background-color 0.4s
                    cubic-bezier(0.165, 0.84, 0.44, 1);
                box-shadow: 0px 0px 2px #1c1c1c;
                position: relative;
            }

            .active {
                background-color: #1c1c1c;
                transform: scale(1.05);
            }

            .key {
                font-size: 1em;
                color: var(--color-text);
                text-transform: uppercase;
                position: absolute;
                bottom: 8px;
                right: 10px;
            }

            .pad-name {
                font-size: 0.7em;
                color: var(--color-text);
                background-color: var(--color-secondary);
                padding: 6px;
                margin-bottom: 4px;
            }
        `,
    ];

    render() {
        return html`
            <div>
                <p class="pad-name typography-200">${this.name}</p>
                <button
                    class=${classMap({
                        pad: true,
                        active: this.isPressed,
                    })}
                >
                    <span class="key typography-500">${this.keyBinding}</span>
                </button>
            </div>
        `;
    }
}

export default function register() {
    window.customElements.define(name, Pad);
}
