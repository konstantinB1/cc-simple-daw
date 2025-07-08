import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { playbackContext } from "./context/playbackContext";
import { ContextProvider } from "@lit/context";
import { createGlobalStylesheet, themeVars } from "./styles";
import StyleManager, { Theme } from "./utils/stylesheets";

import { stylesContext } from "./context/stylesContext";
import { configContext, ConfigContextStore } from "./context/configContext";

import { html } from "@lit-labs/signals";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import AppView from "@modules/view/View";

export function createTheme(context: LitElement) {
    const theme = new Theme(themeVars);

    theme.attachToHost();

    const mgr = new StyleManager(theme);

    return new ContextProvider(context, {
        context: stylesContext,
        initialValue: mgr,
    });
}

export type AppElement = LitElement & {
    playbackProvider: ContextProvider<typeof playbackContext>;
    stylesProvider: ContextProvider<typeof stylesContext>;
    configContext: ContextProvider<typeof configContext>;
};

@customElement("root-app")
export class App extends ScopedRegistryHost(LitElement) {
    static elementDefinitions = {
        "app-view": AppView,
    };

    stylesProvider: ContextProvider<typeof stylesContext> = createTheme(this);

    configContext = new ContextProvider(this, {
        context: configContext,
        initialValue: new ConfigContextStore(),
    });

    connectedCallback(): void {
        super.connectedCallback();
        createGlobalStylesheet();
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
