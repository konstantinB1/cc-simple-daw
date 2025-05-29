import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { KeyManager } from "./lib/KeyManager";

import "@modules/view/View";
import {
    attachPlaybackContextEvents,
    playbackContext,
    PlaybackContextStore,
} from "./context/playbackContext";
import { ContextProvider } from "@lit/context";

@customElement("root-app")
export class App extends LitElement {
    private keyManager: KeyManager = KeyManager.getInstance();

    private playbackProvider = new ContextProvider<typeof playbackContext>(
        this,
        {
            context: playbackContext,
            initialValue: new PlaybackContextStore(),
        },
    );

    connectedCallback(): void {
        super.connectedCallback();
        this.keyManager.createKeyListener();

        attachPlaybackContextEvents(this, this.playbackProvider);
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
                margin: 20px auto;
            }
        `,
    ];

    render() {
        return html`
            <main class="container">
                <app-view></app-view>
            </main>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "root-app": App;
    }
}
