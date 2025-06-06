import PanelScreenManager from "@/lib/PanelScreenManager";
import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
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

    static styles = css`
        .container {
            position: relative;
            width: 100%;
            height: calc(100vh - 40px);
            overflow: hidden;
        }
    `;

    firstUpdated(): void {
        super.connectedCallback();
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
            setTimeout(() => {
                this.screenManager.focus(firstPanel.name);
            });
        }
    }

    private handleClick(event: MouseEvent): void {
        if (
            event.target instanceof HTMLElement &&
            event.target.classList.contains("container")
        ) {
            PanelScreenManager.handleBackgroundClick();
        }
    }

    override render() {
        return html` <top-nav
                .keyboardManager=${this.keyboardManager}
            ></top-nav>
            <div class="container" @click="${this.handleClick}">
                <sampler-root></sampler-root>
                <tracks-panel></tracks-panel>
            </div>`;
    }
}
