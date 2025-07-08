import DragController, { DragEvent } from "@/controllers/DragController";

import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import type { Panel } from "@/lib/PanelScreenManager";

import { store } from "@/store/AppStore";
import { clampXToViewport, clampYToViewport } from "@/utils/geometry";

import {
    CSSResult,
    LitElement,
    css,
    html,
    nothing,
    type PropertyValues,
    type TemplateResult,
} from "lit";

import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

const ELEVATED_Z_INDEX = 100;
const DEFAULT_Z_INDEX = 50;

export interface PanelCardElement extends HTMLElement {
    startPos?: [number, number];
    cardId: string;
    cardWidth?: string;
    cardHeight?: string;
    isDraggable?: boolean;
}

@customElement("panel-card")
export default class PanelCard extends LitElement implements PanelCardElement {
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

    @state()
    private isDragging: boolean = false;

    @state()
    private pos: [number, number] = [0, 0];

    private dragController!: DragController;

    private cardRef: Ref<HTMLElement> = createRef<HTMLElement>();

    @state()
    private elementZIndex: number = 0;

    @state()
    private isFocused: boolean = false;

    @state()
    isFullscreen: boolean = false;

    private panel?: Panel;

    static styles: CSSResult[] = [
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
                box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
                outline: none;
            }

            .card.is-dragging {
                cursor: grabbing;
                box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2);
            }

            .card-header {
                box-sizing: border-box;
                width: 100%;
                height: 55px;
                background-color: var(--color-secondary);
                border-top-left-radius: inherit;
                border-top-right-radius: inherit;
                border: 1px solid var(--color-secondary);
                border-bottom: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .content-wrapper {
                border-top: none;
                border-bottom-left-radius: inherit;
                border-bottom-right-radius: inherit;
                background-color: var(--card-color);
                border: 1px solid var(--color-border);
                border-top: 0;
            }

            .fullscreen-card {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                border: none !important;
            }

            .buttons-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
                padding-right: 10px;
            }

            .card-title {
                font-size: 0.85em;
                color: var(--color-text-primary);
                padding-left: 16px;
            }

            .card-padded {
                padding: 0 16px;
            }

            .card.card.is-focused {
                outline: 2px solid var(--color-tint-primary);
                outline-offset: -2px;
            }

            .icon-wrapper {
                padding-left: 16px;
            }

            .header-title {
                display: flex;
                align-items: center;
            }
        `,
    ];

    private get screenManager() {
        return store.getState().screenManager;
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.panel = this.screenManager.getPanel(this.cardId);

        if (this.startPos) {
            this.pos = this.startPos;
        }
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.dispatchEvent(
            new CustomEvent("state-change", {
                bubbles: true,
                composed: true,
                detail: {
                    cardId: this.cardId,
                    cardWidth: this.cardWidth,
                    cardHeight: this.cardHeight,
                    isDraggable: this.isDraggable,
                },
            }),
        );
        const containerRect =
            this.screenManager.container!.getBoundingClientRect();

        const [x, y] = this.pos;

        this.pos = [x, y];
        this.dragController = new DragController(
            this.computedPos,
            containerRect,
            (e: MouseEvent) =>
                (e.target as HTMLElement).classList.contains("card-draggable"),
        );

        this.dragController.setElement(this.cardRef.value!);

        this.screenManager.onPanelFocused((panel) => {
            if (panel?.name === this.cardId) {
                this.keyboardManager?.attachEventListeners();
                this.elementZIndex = ELEVATED_Z_INDEX;
                this.isFocused = true;
            } else {
                this.keyboardManager?.detachEventListeners();
                this.elementZIndex = DEFAULT_Z_INDEX;
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
                        break;
                    case DragEvent.Dragging:
                        this.pos = [x, y];
                        break;
                    case DragEvent.End:
                        this.isDragging = false;
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
        this.panel?.toggleFullscreen();

        if (this.isFullscreen) {
            this.elementZIndex = ELEVATED_Z_INDEX;
        }

        this.isFullscreen = this.panel?.isFullscreen ?? false;
        this.dragController.enabled = !this.isFullscreen;
    }

    private get renderFullscreenButton(): TemplateResult | symbol {
        if (!this.panel || !this.panel.canFullscreen) {
            return nothing;
        }

        return html` <icon-button
            variant="basic"
            size=${30}
            @handle-click=${this.handleDoubleClick.bind(this)}
        >
            <fullscreen-icon .size=${18}></fullscreen-icon>
        </icon-button>`;
    }

    private get computedPos(): [number, number] {
        const [x, y] = this.pos;
        const containerRect =
            this.screenManager.container!.getBoundingClientRect();
        const width = this.cardRef.value?.offsetWidth ?? 0;
        const height = this.cardRef.value?.offsetHeight ?? 0;

        containerRect.height = containerRect.height - 70; // Adjust for header height

        return [
            clampXToViewport(x, width),
            clampYToViewport(containerRect, y, height),
        ];
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
        const [x, y] = this.computedPos;

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
            transform: `translate(${this.isFullscreen ? 0 : x}px, ${this.isFullscreen ? 0 : y}px)`,
            width: this.isFullscreen ? "100%" : this.cardWidth,
            height: !this.isFullscreen ? this.cardHeight : "100%",
            zIndex: this.elementZIndex,
            top: !this.isFullscreen ? "0" : `${80}px`,
        });

        return html`<div
            tabindex="0"
            @focus=${this.handleFocus}
            ${ref(this.cardRef)}
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
                <div class="header-title">
                    ${this.renderIcon}
                    <text-element variant="tiny" class="card-title">
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
        </div> `;
    }
}
