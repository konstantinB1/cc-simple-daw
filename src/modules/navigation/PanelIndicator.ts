import IconButton from "@/components/IconButton";
import ArrowLeftIcon from "@/components/icons/ArrowLeftIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import MenuList from "@/components/Menu";
import MenuItem, { type ClickEventDetail } from "@/components/MenuItem";
import Text from "@/components/Text";
import type { Panel } from "@/lib/PanelScreenManager";
import type PanelScreenManager from "@/lib/PanelScreenManager";
import { helperStyles } from "@/styles";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("panel-indicator")
export default class PanelIndicator extends ScopedRegistryHost(LitElement) {
    static elementDefinitions = {
        "icon-button": IconButton,
        "text-element": Text,
        "arrow-right-icon": ArrowRightIcon,
        "arrow-left-icon": ArrowLeftIcon,
        "menu-list": MenuList,
        "menu-item": MenuItem,
    };

    @property({ type: Object })
    screenManager!: PanelScreenManager;

    @property({ type: Object })
    currentPanel?: Panel;

    @property({ type: Boolean })
    showPanelList: boolean = false;

    @query("#panel-indicator")
    private container!: HTMLElement;

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
        this.screenManager.focusNext();
        this.requestUpdate();
    }

    private focusPreviousPanel(): void {
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

    private openPanelMenu(): void {
        this.showPanelList = !this.showPanelList;
    }

    private get renderPanelList(): TemplateResult {
        const panels = this.screenManager.panels;

        return html`
            ${panels.map(
                ({ displayName, name }) => html`
                    <menu-item
                        .selected=${this.currentPanel?.name === name}
                        .value=${name}
                        .label=${displayName}
                    ></menu-item>
                `,
            )}
        `;
    }

    private handleMenuItemClick({
        detail: { value },
    }: CustomEvent<ClickEventDetail>): void {
        this.screenManager.focus(value);
    }

    protected override render() {
        return html`
            <div
                @click=${this.openPanelMenu}
                id="panel-indicator"
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
            </div>
            <menu-list
                .container=${this.container}
                @click=${this.openPanelMenu}
                @menu-item-click=${this.handleMenuItemClick}
                anchor="bottom-right"
                @close=${() => (this.showPanelList = false)}
                .visible=${this.showPanelList}
                .value=${this.currentPanel?.name ?? ''}
            >
                ${this.renderPanelList}
            </menu-list>
        `;
    }
}
