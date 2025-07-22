import DragController, {
    DragEvent,
} from "@/components/drag-system/DragController";

import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import type { Panel } from "@/lib/PanelScreenManager";

import { store } from "@/store/AppStore";
import { helperStyles, zIndex } from "@/styles";

import {
    CSSResult,
    LitElement,
    css,
    html,
    nothing,
    type PropertyValues,
    type TemplateResult,
} from "lit";

import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import PanelPosition from "../PanelPosition";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import Text from "@/components/Text";
import { PanelDragEvent } from "./PanelEvents";
import IconButton from "@/components/IconButton";
import FullscreenIcon from "@/components/icons/IconFullscreen";

export interface PanelCardElement extends HTMLElement {
    startPos?: [number, number];
    cardId: string;
    cardWidth?: string;
    cardHeight?: string;
    isDraggable?: boolean;
}

@customElement("panel-card")
export default class PanelCard
    extends ScopedRegistryHost(LitElement)
    implements PanelCardElement
{
    @property({ type: Array })
    startPos?: [number, number];

    @property({ type: String })
    cardId!: string;

    @property({ type: String, attribute: "card-width" })
    cardWidth: string = "auto";

    @property({ type: String, attribute: "card-height" })
    cardHeight: string = "auto";

    @property({ type: Boolean })
    isDraggable?: boolean;

    @property({ type: Object, attribute: false })
    keyboardManager?: LayeredKeyboardManager;

    @property({ type: Boolean, attribute: true })
    padded: boolean = false;

    @property({ type: String })
    icon?: string;

    @property({ type: Boolean })
    canFullscreen: boolean = true;

    @state()
    private isDragging: boolean = false;

    @state()
    private pos: [number, number] = [0, 0];

    @state()
    private elementZIndex: number = 0;

    @state()
    private isFocused: boolean = false;

    @state()
    isFullscreen: boolean = false;

    @state()
    private prevPos?: [number, number];

    @query(".card", true)
    private cardRefElement!: HTMLElement;

    private panel?: Panel;
    private dragController!: DragController;

    @property({ type: String })
    a: string = "normal";

    static elementDefinitions = {
        "text-element": Text,
        "icon-button": IconButton,
        "fullscreen-icon": FullscreenIcon,
    };

    static styles: CSSResult[] = [
        helperStyles,
        css`
            :host {
                display: block;
                height: 100%;
            }

            .card {
                display: flex;
                flex-direction: column;
                background-color: var(--card-color);
                border-radius: var(--border-radius);
                position: absolute;
                box-shadow: 0 0px 2px rgba(1, 1, 1, 0.5);
                outline: none;
                transition: opacity 0.15s ease-in-out;

                opacity: 0.92;
            }

            .card.is-dragging {
                cursor: grabbing;
                box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2);
            }

            .card-header {
                box-sizing: border-box;
                width: 100%;
                height: 45px;
                background-color: var(--color-secondary);
                border-top-left-radius: inherit;
                border-top-right-radius: inherit;
                border-bottom: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .content-wrapper {
                height: 100%;
                border-top: none;
                border-bottom-left-radius: inherit;
                border-bottom-right-radius: inherit;
                background-color: var(--card-color);
                border: 1px solid var(--color-border);
                border-top: 0;
            }

            .card.fullscreen-card {
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                position: relative;
                border-radius: 0;
            }

            .buttons-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
                padding-right: 10px;
            }

            .card-padded {
                padding: 0 16px;
            }

            .icon-wrapper {
                padding-left: 16px;
            }

            .header-title {
                display: flex;
                align-items: center;
            }

            .indicator {
                border-radius: 50%;
                width: 8px;
                height: 8px;
                background-color: var(--color-warning);
                margin: auto;
            }

            .indicator-focused {
                background-color: var(--color-success);
            }

            .card.indicator-focused {
                background-color: var(--color-success);
                transform: scale(1);
                opacity: 1;
            }

            .card.is-focused {
                background-color: var(--color-success);
                transform: scale(1);
                opacity: 1;
            }
        `,
    ];

    private get screenManager() {
        return store.getState().screenManager;
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.panel = this.screenManager.getPanel(this.cardId);

        if (!this.panel) {
            throw new Error(`Panel with ID ${this.cardId} not found`);
        }

        if (this.startPos) {
            this.pos = this.startPos;
        }
    }

    protected updated(_changedProperties: PropertyValues): void {}

    protected async firstUpdated(
        _changedProperties: PropertyValues,
    ): Promise<void> {
        await this.updateComplete;

        const position = new PanelPosition(
            this.cardRefElement,
            this.screenManager.rootContainer,
        );

        const startPos = await position.computePosition(
            ...(this.startPos ?? [0, 0]),
        );

        this.pos = startPos;

        this.dragController = new DragController(
            position,
            (e: MouseEvent) =>
                (e.target as HTMLElement).classList.contains("card-draggable"),
            startPos,
        );

        this.screenManager.onPanelFocused((panel) => {
            if (panel?.name === this.cardId) {
                this.keyboardManager?.attachEventListeners();
                this.elementZIndex = zIndex.panelFocused;
                this.isFocused = true;
            } else {
                this.keyboardManager?.detachEventListeners();
                this.elementZIndex = zIndex.panelNormal;
                this.isFocused = false;
                this.screenManager.quetlyUnfocus();
            }
        });

        this.dragController.onDragChange.call(
            this.dragController,
            ({ event, coords: [x, y] }) => {
                switch (event) {
                    case DragEvent.Start:
                        this.screenManager.focus(this.cardId);
                        this.isDragging = true;

                        this.dispatchEvent(
                            new PanelDragEvent(this.cardId, this.pos, true),
                        );
                        break;
                    case DragEvent.Dragging:
                        this.pos = [x, y];
                        this.dispatchEvent(
                            new PanelDragEvent(this.cardId, [x, y], true),
                        );
                        break;
                    case DragEvent.End:
                        this.isDragging = false;
                        this.dispatchEvent(
                            new PanelDragEvent(this.cardId, this.pos, false),
                        );
                        break;
                }
            },
        );

        super.firstUpdated(_changedProperties);
    }

    private handleFocus(): void {
        this.screenManager.focus(this.cardId);
    }

    private handleDoubleClick(): void {
        if (!this.canFullscreen) {
            return;
        }

        this.panel?.toggleFullscreen();
        this.isFullscreen = !!this.panel?.isFullscreen;
        this.dragController.enabled = !this.isFullscreen;

        if (this.isFullscreen) {
            this.prevPos = this.pos;
            this.elementZIndex = zIndex.panelFullScreen;
        } else {
            if (this.prevPos) {
                this.pos = this.prevPos;
            }

            this.elementZIndex = zIndex.panelFocused;
        }
    }

    private get renderFullscreenButton(): TemplateResult | symbol {
        if (!this.panel || !this.panel.canFullscreen) {
            return nothing;
        }

        return html` <icon-button
            size=${26}
            @handle-click=${this.handleDoubleClick.bind(this)}
        >
            <fullscreen-icon .size=${14}></fullscreen-icon>
        </icon-button>`;
    }

    private get panelName(): string {
        return this.panel ? this.panel.displayName : "Unknown Panel";
    }

    private get renderIcon(): TemplateResult<1> | symbol {
        if (!this.icon) {
            return nothing;
        }

        const Icon = customElements.get(this.icon);

        if (!Icon) {
            console.warn(`Icon ${this.icon} not found`);
            return nothing;
        }

        const element = document.createElement(this.icon) as HTMLElement;
        element.setAttribute("size", "30");

        return html`<div class="icon-wrapper">
            ${unsafeHTML(element.outerHTML)}
        </div>`;
    }

    override render(): TemplateResult {
        let [x, y] = this.pos;

        x = this.isFullscreen ? 0 : x;
        y = this.isFullscreen ? 0 : y;

        let handleMouseDown = (_: MouseEvent) => {};

        if (this.isDraggable && this.dragController) {
            handleMouseDown = this.dragController.handleMouseDown.bind(
                this.dragController,
            );
        }

        const classes = classMap({
            card: true,
            "is-dragging": this.isDragging,
            "is-focused": this.isFocused,
            "fullscreen-card": this.isFullscreen,
            relative: true,
        });

        const headerClasses = classMap({
            "card-header": true,
            "card-draggable": !!this.isDraggable,
        });

        const contentClasses = classMap({
            "content-wrapper": true,
            "card-padded": this.padded,
        });

        const styles = styleMap({
            transform: `translate(${x}px, ${y}px)`,
            width: this.isFullscreen ? "100%" : this.cardWidth,
            height: !this.isFullscreen ? this.cardHeight : "100%",
            zIndex: this.elementZIndex,
            top: 0,
        });

        const activeIndicatorClasses = classMap({
            "indicator-focused": this.isFocused,
            indicator: true,
        });

        return html`<div
            tabindex="0"
            @focus=${this.handleFocus}
            id=${this.cardId}
            class=${classes}
            style=${styles}
            @mousedown="${handleMouseDown}"
            @click="${this.handleFocus.bind(this)}"
        >
            <div
                class=${headerClasses}
                @dblclick="${this.handleDoubleClick.bind(this)}"
            >
                <div class="flex flex-start gap-1 pl-4">
                    <div class=${activeIndicatorClasses}></div>
                    <!-- ${this.renderIcon} -->
                    <text-element variant="body1" class="pl-2">
                        ${this.panelName}
                    </text-element>
                </div>
                <div class="buttons-wrapper">
                    <slot name="header"> ${this.renderFullscreenButton} </slot>
                </div>
            </div>
            <div class=${contentClasses}>
                <slot></slot>
            </div>
        </div>`;
    }
}
