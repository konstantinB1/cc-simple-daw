import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "@modules/view/View";
import {
    attachPlaybackContextEvents,
    playbackContext,
    PlaybackContextStore,
} from "./context/playbackContext";
import { ContextProvider } from "@lit/context";
@customElement("root-app")
export class App extends LitElement {
    private playbackProvider = new ContextProvider(this, {
        context: playbackContext,
        initialValue: new PlaybackContextStore(),
    });

    connectedCallback(): void {
        super.connectedCallback();

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
                --color-tint-primary: #fd1d1d;
                --border-radius: 10px;
                --nav-bg-color: #595959;
                --color-success: #5ace5e;
                --color-error: #f44336;
                --color-warning: #ff9800;
                --color-info: #2196f3;
                --color-border: #333333;
                --color-border-light: #444444;
            }

            html {
                background-color: red;
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
