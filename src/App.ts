import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { createGlobalStylesheet, themeVars } from "./styles";
import StyleManager, { Theme } from "./utils/stylesheets";

import { html } from "lit";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import AppView from "@modules/view/View";

export function createTheme() {
    const theme = new Theme(themeVars);
    theme.attachToHost();
    return new StyleManager(theme);
}

export type AppElement = LitElement;

@customElement("root-app")
export class App extends ScopedRegistryHost(LitElement) {
    static elementDefinitions = {
        "app-view": AppView,
    };

    connectedCallback(): void {
        super.connectedCallback();
        createTheme();
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
