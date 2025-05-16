import { css, html, LitElement, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

const name = "daw-pad";

@customElement("daw-pad")
class Pad extends LitElement {
    @property({ type: String, attribute: "key-binding" })
    keyBinding: string = "";

    @property({ type: Boolean })
    isPressed: boolean = false;

    constructor() {
        super();
    }

    static styles?: CSSResultGroup | undefined = css`
        .pad {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 3px;
            border: 1px solid var(--color-accent);
            background-color: var(--color-secondary);
            width: 120px;
            height: 120px;
            transition: background-color 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
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
    `;

    render() {
        console.log("rendering pad", this.keyBinding, this.isPressed);
        return html`
            <div class="pad ${this.isPressed ? "active" : ""}">
                <p class="key typography-100">${this.keyBinding}</p>
            </div>
        `;
    }
}

export default function register() {
    window.customElements.define(name, Pad);
}
