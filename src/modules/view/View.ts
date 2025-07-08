import { PanelType, type PanelCreateOptions } from "@/lib/PanelScreenManager";
import { css, html, LitElement } from "lit";
import { query } from "lit/decorators.js";
import "./PanelCard";
import "../panels/tracks/Tracks";
import "../panels/sampler/Sampler";

import { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import { store } from "@/store/AppStore";

const currentPanels: PanelCreateOptions[] = [
    {
        name: "tracks-panel",
        displayName: "Tracks",
        type: PanelType.Essential,
        startPos: [520, 350],
    },
    {
        name: "sampler-root",
        displayName: "Sampler",
        type: PanelType.VSTI,
        startPos: [10, 0],
    },
    {
        name: "simple-keyboard",
        displayName: "Basic Keyboard",
        type: PanelType.VSTI,
        startPos: [520, 0],
        icon: "keyboard-icon",
    },
];

export default class AppView extends LitElement {
    keyboardManager: LayeredKeyboardManager = new LayeredKeyboardManager();

    @query("#root-container")
    private container!: HTMLElement;

    static styles = css`
        .container {
            position: relative;
            height: calc(100vh - var(--container-top-offset));
            top: 35px;
            overflow: hidden;
        }
    `;

    private get screenManager() {
        return store.getState().screenManager;
    }

    firstUpdated(): void {
        super.connectedCallback();

        this.screenManager.container = this.container;

        this.keyboardManager.attachEventListeners();

        currentPanels.forEach(
            this.screenManager.createAndAppend.bind(this.screenManager),
        );

        this.keyboardManager.addKeys([
            {
                active: true,
                keys: ["Shift", "C", "ArrowRight"],
                description: "Focus next panel",
                handler: () => this.screenManager.focusNext(),
            },
            {
                active: true,
                keys: ["Shift", "C", "ArrowLeft"],
                description: "Focus previous panel",
                handler: () => this.screenManager.focusPrevious(),
            },
        ]);
    }

    override render() {
        return html` <top-nav
                .screenManager=${this.screenManager}
                .keyboardManager=${this.keyboardManager}
            ></top-nav>
            <div class="container" id="root-container"></div>`;
    }
}
