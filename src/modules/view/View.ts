import PanelScreenManager from "@/lib/PanelScreenManager";
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
            height: calc(100vh - 50px);
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
            <div class="container" id="root-container">
                <tracks-panel></tracks-panel>
                <sampler-root></sampler-root>
            </div>`;
    }
}
