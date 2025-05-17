import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { KeyManager } from "./lib/KeyManager";

@customElement("root-app")
export class App extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    connectedCallback(): void {
        super.connectedCallback();
        this.keyManager.createKeyListener();

        const path = window.location.pathname;

        if (path !== "/") {
            throw new Error("Invalid path");
        }
    }

    static styles = [
        css`
            .container {
                width: var(--container-width);
                margin: 20vh auto;
            }

            .pads-wrapper {
                background-color: var(--color-primary);
                border-radius: 3px;
                border: 1px solid var(--color-accent);
            }
        `,
    ];

    render() {
        return html`
            <main class="container">
                <program-container></program-container>
                <section class="pads-wrapper">
                    <pads-container></pads-container>
                </section>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "root-app": App;
    }
}
