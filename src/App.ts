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
            :host {
                --color-primary: #1d1d1d;
                --color-secondary: #171717;
                --color-accent: hwb(0 22% 78%);
                --color-text: #ffffff;
                --color-background: #181818;
                --container-width: 1200px;
                --container-height: 60vh;
                --card-color: #2c2c2c;
                --color-tint-primary: #d95656;
                --border-radius: 10px;
            }

            html {
                background-color: var(--color-background);
            }

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
