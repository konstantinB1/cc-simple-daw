import DragController, { DragEvent } from "@/controllers/DragController";
import PanelManager from "@/lib/PanelManager";
import { CSSResult, LitElement, css, html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

const ELEVATED_Z_INDEX = 100;
const DEFAULT_Z_INDEX = 50;

@customElement("card-component")
export default class Card extends LitElement {
    @state()
    private pos: [number, number] = [0, 0];

    @state()
    private isDragging: boolean = false;

    @property({ type: String, attribute: "card-width" })
    public cardWidth: string = "auto";

    private dragController: DragController = new DragController();

    private cardId: string;

    private panelManager: PanelManager = PanelManager.getInstance();

    @state()
    private elementZIndex: number = 0;

    constructor() {
        super();

        const cardId = this.getAttribute("card-id");

        if (cardId == null) {
            throw new Error(
                "Card ID is not set, panel manager for this card will not work",
            );
        }

        this.cardId = cardId;

        this.panelManager.add(cardId).listen(cardId, ({ isCurrent }) => {
            this.elementZIndex = isCurrent ? ELEVATED_Z_INDEX : DEFAULT_Z_INDEX;
        });

        this.dragController.onDragChange.call(
            this.dragController,
            ({ event, coords: [x, y] }) => {
                switch (event) {
                    case DragEvent.Start:
                        this.panelManager.notify(cardId);
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
            zIndex: this.elementZIndex,
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
