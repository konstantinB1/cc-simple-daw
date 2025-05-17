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

    constructor() {
        super();
    }

    static styles: CSSResultGroup = [
        typography,
        css`
            .pad {
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 3px;
                border: 0;
                background-color: var(--color-secondary);
                width: 100px;
                height: 100px;
                transition: background-color 0.4s
                    cubic-bezier(0.165, 0.84, 0.44, 1);
                box-shadow: 0 0 2 px #000;
            }

            .active {
                background-color: var(--color-primary);
                transform: scale(1.05);
            }

            .key {
                font-size: 2em;
                color: var(--color-text);
                text-align: center;
                line-height: 120px;
                text-transform: uppercase;
            }

            .pad-name {
                margin-bottom: 4px;
                margin-left: 2px;
                font-size: 0.7em;
                color: var(--color-text);
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
                    <p class="key typography-100">${this.keyBinding}</p>
                </button>
            </div>
        `;
    }
}

export default function register() {
    window.customElements.define(name, Pad);
}
