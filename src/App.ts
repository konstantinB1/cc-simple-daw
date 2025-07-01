import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import "@modules/view/View";
import {
    attachPlaybackContextEvents,
    playbackContext,
    PlaybackContextStore,
} from "./context/playbackContext";
import { ContextProvider } from "@lit/context";
import { themeVars } from "./styles";
import StyleManager, { Theme } from "./utils/stylesheets";

import { stylesContext } from "./context/stylesContext";

export function createTheme(context: LitElement) {
    const theme = new Theme(themeVars);

    theme.attachToHost();

    const mgr = new StyleManager(theme);

    return new ContextProvider(context, {
        context: stylesContext,
        initialValue: mgr,
    });
}

@customElement("root-app")
export class App extends LitElement {
    playbackProvider = new ContextProvider(this, {
        context: playbackContext,
        initialValue: new PlaybackContextStore(),
    });

    stylesProvider: ContextProvider<typeof stylesContext> = createTheme(this);

    connectedCallback(): void {
        super.connectedCallback();
        attachPlaybackContextEvents(this, this.playbackProvider);
    }

    static styles = [
        css`
            :host {
                display: block;
                height: 100%;
                width: 100%;
                overflow: hidden;
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
