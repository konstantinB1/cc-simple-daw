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

    @property({ type: Boolean, attribute: true })
    padded: boolean = false;

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

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.dragController = new DragController(this.startPos);
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
            background-color: var(--card-color);
            border-radius: var(--border-radius);
            border: 1px solid var(--color-accent);
            position: absolute;
            box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
        }

        .card.is-dragging {
            cursor: grabbing;
            box-shadow: 0 1px 7px rgba(0, 0, 0, 0.2);
        }

        .card.is-focused {
            border: 1px solid #533f3f;
        }

        .card-header {
            width: 100%;
            height: 50px;
            background-color: var(--color-secondary);
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;
        }

        .content-wrapper {
            border-top: none;
            border-bottom-left-radius: inherit;
            border-bottom-right-radius: inherit;
            background-color: var(--card-color);
        }

        .card-padded {
            padding: 0 20px 20px 20px;
        }
    `;

    private handleDoubleClick(): void {}

    override render(): TemplateResult {
        const [x, y] = this.pos;
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
            @dblclick="${this.handleDoubleClick.bind(this)}"
            @click="${this.handleFocus.bind(this)}"
        >
            <div class=${headerClasses}>
                <slot name="header"></slot>
            </div>
            <div class=${contentClasses}>
                <slot></slot>
            </div>
        </div> `;
    }
}
