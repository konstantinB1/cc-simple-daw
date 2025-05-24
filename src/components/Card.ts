import DragController, { DragEvent } from "@/controllers/DragController";
import { CSSResult, LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("card-component")
export default class Card extends LitElement {
    @state()
    private pos: [number, number] = [0, 0];

    @state()
    private isDragging: boolean = false;

    @property({ type: String, attribute: "card-width" })
    public cardWidth: string = "auto";

    @property({ type: String, attribute: "card-id" })
    private cardId: string = "";

    private dragController: DragController = new DragController();

    constructor() {
        super();

        this.dragController.onDragChange.call(
            this.dragController,
            ({ event, coords: [x, y] }) => {
                switch (event) {
                    case DragEvent.Start:
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

    static styles: CSSResult = css`
        :root {
            --color-drag: #3f3f3f;
        }

        .card {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background-color: var(--card-color);
            border-radius: var(--border-radius);
            border: 1px solid var(--color-accent);
            overflow: auto;
            position: absolute;
        }

        .card.is-dragging {
            cursor: grabbing;
            border: 1px solid var(--color-tint-primary);
        }
    `;

    connectedCallback(): void {
        super.connectedCallback();

        if (!this.cardId) {
            throw new Error(
                "Card ID is not set, panel manager for this card will not work",
            );
        }
    }

    render(): TemplateResult {
        const [x, y] = this.pos;
        const handleMouseDown = this.dragController.handleMouseDown.bind(
            this.dragController,
        );

        const classes = classMap({
            card: true,
            "is-dragging": this.isDragging,
        });

        const styles = styleMap({
            transform: `translate(${x}px, ${y}px)`,
            width: this.cardWidth,
        });

        return html`<div
            id=${this.cardId}
            class=${classes}
            style=${styles}
            @mousedown="${handleMouseDown}"
        >
            <slot></slot>
        </div> `;
    }
}
