import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { KeyManager } from "./lib/KeyManager";

@customElement("root-app")
export class App extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    constructor() {
        super();

        this.keyManager.createKeyListener();
    }

    static styles = [
        css`
            .content {
                border-radius: 3px;
                background-color: var(--color-primary);
                width: var(--container-width);
                height: var(--container-height);
                margin: 20vh auto;
                border: 1px solid var(--color-accent);
            }
        `,
    ];

    render() {
        return html`
            <main class="content">
                <pads-container></pads-container>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "root-app": App;
    }
}
