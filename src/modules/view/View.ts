import { PanelType, type PanelCreateOptions } from "@/lib/PanelScreenManager";
import { css, html, LitElement } from "lit";
import { query } from "lit/decorators.js";

import { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import { store } from "@/store/AppStore";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import PanelCard from "./panel-card/PanelCard";
import TopNav from "../navigation/TopNav";
import TracksPanel, { tracksPanelId } from "../panels/tracks/Tracks";
import SamplerPanel, { samplerPanelId } from "../panels/sampler/Sampler";
import SimpleKeyboardPanel, {
    basicKeyboardPanelId,
} from "../panels/basic-keyboard/BasicKeyboard";

const currentPanels: PanelCreateOptions[] = [
    {
        name: tracksPanelId,
        displayName: "Tracks",
        type: PanelType.Essential,
        startPos: [520, 350],
        element: TracksPanel,
    },
    {
        name: samplerPanelId,
        displayName: "Sampler",
        type: PanelType.VSTI,
        startPos: [10, 0],
        element: SamplerPanel,
    },
    {
        name: basicKeyboardPanelId,
        displayName: "Basic Keyboard",
        type: PanelType.VSTI,
        startPos: [520, 0],
        icon: "keyboard-icon",
        element: SimpleKeyboardPanel,
    },
];

export default class AppView extends ScopedRegistryHost(LitElement) {
    keyboardManager: LayeredKeyboardManager = new LayeredKeyboardManager();

    static elementDefinitions = {
        "panel-card": PanelCard,
        "top-nav": TopNav,
    };

    @query("#root-container")
    private container!: HTMLElement;

    static styles = css`
        :host {
            display: block;
            height: 100%;
            width: 100%;
            position: relative;
            overflow: hidden;

            --navbar-padding: 10px;
        }

        .container {
            position: relative;
            height: calc(100vh - var(--navbar-height));
        }
    `;

    private get screenManager() {
        return store.getState().screenManager;
    }

    firstUpdated(): void {
        super.connectedCallback();

        this.screenManager.setRootContainer(this.container);

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
