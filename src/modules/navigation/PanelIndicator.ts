import type { Panel } from "@/lib/PanelScreenManager";
import type PanelScreenManager from "@/lib/PanelScreenManager";
import { helperStyles } from "@/styles";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("panel-indicator")
export default class PanelIndicator extends LitElement {
    @property({ type: Object })
    screenManager!: PanelScreenManager;

    @property({ type: Object })
    currentPanel?: Panel;

    static styles = [
        helperStyles,
        css`
            :host {
                display: block;
                height: 40px;
                width: 250px;
            }
        `,
    ];

    connectedCallback(): void {
        super.connectedCallback();

        this.screenManager.onPanelFocused((panel) => {
            this.currentPanel = panel;
            this.requestUpdate();
        });
    }

    private focusNextPanel(): void {
        if (!this.currentPanel) {
            return;
        }

        this.screenManager.focusNext();
        this.requestUpdate();
    }

    private focusPreviousPanel(): void {
        if (!this.currentPanel) {
            return;
        }

        this.screenManager.focusPrevious();
        this.requestUpdate();
    }

    private get renderPanelText(): TemplateResult {
        return this.currentPanel
            ? html`<text-element variant="body2"
                  >${this.currentPanel.displayName}</text-element
              >`
            : html`<text-element variant="body2"
                  >No panel focused</text-element
              >`;
    }

    protected override render() {
        return html` <div
            class="bg-secondary border-accent panel-indicator flex flex-center full-height p-4 bbox radius-normal relative"
        >
            <div class="absolute" style="left: 10px">
                <icon-button
                    variant="basic"
                    size=${25}
                    @handle-click=${this.focusPreviousPanel}
                >
                    <arrow-left-icon size=${20}></arrow-left-icon>
                </icon-button>
            </div>
            ${this.renderPanelText}
            <div class="absolute right" style="right: 10px">
                <icon-button
                    variant="basic"
                    size=${25}
                    @handle-click=${this.focusNextPanel}
                >
                    <arrow-right-icon size=${20}></arrow-right-icon>
                </icon-button>
            </div>
        </div>`;
    }
}
