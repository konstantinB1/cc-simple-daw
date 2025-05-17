import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { KeyManager } from "./lib/KeyManager";

@customElement("root-app")
export class App extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    connectedCallback(): void {
        super.connectedCallback();
        this.keyManager.createKeyListener();
    }

    static styles = [
        css`
            .container {
                width: var(--container-width);
                margin: 20px auto;
            }
        `,
    ];

    render() {
        return html`
            <main class="container">
                <main-init></main-init>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "root-app": App;
    }
}
