import PanelScreenManager, {
    PanelType,
    type PanelCreateOptions,
} from "@/lib/PanelScreenManager";
import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "./PanelCard";
import "../panels/tracks/Tracks";
import "../panels/sampler/Sampler";
import { provide } from "@lit/context";
import screenManagerContext from "@/context/screenManagerContext";

import channelsContext, {
    attachChannelContextEvents,
} from "@/context/channelsContext";
import { ContextProvider } from "@lit/context";
import { LayeredKeyboardManager } from "@/lib/KeyboardManager";

// This is hardcoded list of panels for now.
// This functionality will be expanded for adding/removing panels dynamically in the future.
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

@customElement("app-view")
export default class AppView extends LitElement {
    @provide({ context: screenManagerContext })
    screenManager: PanelScreenManager = new PanelScreenManager();

    channelsCtx: ContextProvider<typeof channelsContext> = new ContextProvider<
        typeof channelsContext
    >(this, {
        context: channelsContext,
        initialValue: {
            channels: [],
        },
    });

    keyboardManager: LayeredKeyboardManager = new LayeredKeyboardManager();

    @query("#root-container")
    private container!: HTMLElement;

    static styles = css`
        .container {
            position: relative;
            height: calc(100vh - var(--container-top-offset));
            top: 30px;
            overflow: hidden;
        }
    `;

    firstUpdated(): void {
        super.connectedCallback();

        this.screenManager.container = this.container;
        attachChannelContextEvents(this, this.channelsCtx);

        this.keyboardManager.attachEventListeners();

        const firstPanel = this.screenManager.panels?.[0];

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

        if (firstPanel) {
            requestAnimationFrame(() => {
                this.screenManager.focus(firstPanel.name);
            });
        }
    }

    override render() {
        return html` <top-nav
                .keyboardManager=${this.keyboardManager}
            ></top-nav>
            <div class="container" id="root-container"></div>`;
    }
}
