import DragController, { DragEvent } from "@/controllers/DragController";
import type { LayeredKeyboardManager } from "@/lib/KeyboardManager";
import WithScreenManager from "@/mixins/WithScreenManager";
import {
    CSSResult,
    LitElement,
    css,
    html,
    type PropertyValues,
    type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";

const ELEVATED_Z_INDEX = 100;
const DEFAULT_Z_INDEX = 50;

export interface PanelCardProps {
    startPos?: [number, number];
    cardId: string;
    cardWidth?: string;
    cardHeight?: string;
    isDraggable?: boolean;
}

@customElement("panel-card")
export default class PanelCard
    extends WithScreenManager(LitElement)
    implements PanelCardProps
{
    @property({ type: Array })
    startPos?: [number, number];

    @property({ type: String, attribute: "card-id" })
    cardId!: string;

    @property({ type: String, attribute: "card-width" })
    cardWidth: string = "auto";

    @property({ type: String, attribute: "card-height" })
    cardHeight: string = "auto";

    @property({ type: Boolean })
    isDraggable?: boolean;

    @property({ type: Object, attribute: false })
    keyboardManager?: LayeredKeyboardManager;

    @state()
    private isDragging: boolean = false;

    @state()
    private pos: [number, number] = [0, 0];

    private dragController: DragController = new DragController();

    private cardRef: Ref<HTMLElement> = createRef<HTMLElement>();

    @state()
    private elementZIndex: number = 0;

    @state()
    private isFocused: boolean = false;

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.dragController.setElement(this.cardRef.value!);

        if (!this.screenManager) {
            return;
        }

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
    }

    private handleFocus(): void {
        this.screenManager.focus(this.cardId);
    }

    connectedCallback(): void {
        super.connectedCallback();

        if (this.startPos) {
            this.pos = this.startPos;
        }
    }

    static styles: CSSResult = css`
        :root {
            --color-drag: #3f3f3f;
        }

        .card {
            display: flex;
            flex-direction: column;
            padding: 20px;
            background-color: var(--card-color);
            border-radius: var(--border-radius);
            border: 1px solid var(--color-accent);
            position: absolute;
        }

        .card.is-dragging {
            cursor: grabbing;
            border: 1px solid var(--color-tint-primary);
        }

        .card.is-focused {
            border: 1px solid var(--color-tint-primary);
        }
    `;

    override render(): TemplateResult {
        const [x, y] = this.pos;
        let handleMouseDown = (_: MouseEvent) => {};
        if (this.isDraggable) {
            handleMouseDown = this.dragController.handleMouseDown.bind(
                this.dragController,
            );
        }

        const classes = classMap({
            card: true,
            "is-dragging": this.isDragging,
            "is-focused": this.isFocused,
        });

        const styles = styleMap({
            transform: `translate(${x}px, ${y}px)`,
            width: this.cardWidth,
            height: this.cardHeight,
            zIndex: this.elementZIndex,
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
            <div class="card-header">
                <slot name="header"></slot>
            </div>
            <div class="content-wrapper">
                <slot></slot>
            </div>
        </div> `;
    }
}
