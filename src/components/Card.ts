import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";

const ELEVATED_Z_INDEX = 10;
const NORMAL_Z_INDEX = 0;
const HOLD_TIMEOUT_MS = 250;

@customElement("card-component")
export default class Card extends LitElement {
    @state()
    private pos: [number, number] = [0, 0];

    @state()
    private isDragging: boolean = false;

    @state()
    private elevateZIndex: number = 0;

    @property({ type: String, attribute: "card-width" })
    public cardWidth: string = "auto";

    @property({ type: String, attribute: "card-id" })
    private cardId: string = "";

    private dragOffset: [number, number] = [0, 0];

    private cardRef: Ref<HTMLElement> = createRef();

    private holdTimeout: NodeJS.Timeout | null = null;

    static styles = css`
        :root {
            --color-drag: #3f3f3f;
        }

        .card {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 20px;
            background-color: var(--card-color);
            border-radius: 2px;
            border: 1px solid var(--color-accent);
            position: relative;
            overflow: auto;
            position: absolute;
            transition: transform 0.05s linear;
        }

        .card.is-dragging {
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

    private get unsafeCardRefRect(): DOMRect {
        const value = this.cardRef.value;

        if (!value) {
            throw new Error("Card reference is not set");
        }

        return value.getBoundingClientRect();
    }

    private handleMouseDown(event: MouseEvent): void {
        this.holdTimeout = setTimeout(() => {
            this.isDragging = true;
            this.dragOffset = [
                event.clientX - this.unsafeCardRefRect.left,
                event.clientY - this.unsafeCardRefRect.top,
            ];

            this.elevateZIndex = ELEVATED_Z_INDEX;
        }, HOLD_TIMEOUT_MS);
    }

    private handleMouseUp(_: MouseEvent): void {
        if (this.holdTimeout) {
            clearTimeout(this.holdTimeout);
        }

        this.isDragging = false;
        this.elevateZIndex = NORMAL_Z_INDEX;
        this.dragOffset = [0, 0];
    }

    private handleMouseMove(event: MouseEvent): void {
        if (!this.isDragging) {
            return;
        }

        console.log(this.unsafeCardRefRect);

        const randomNumber = -250;

        const [offsetX, offsetY] = this.dragOffset;
        const diffX = event.clientX - offsetX + randomNumber;
        const diffY = event.clientY - offsetY;

        this.pos = [diffX < 0 ? 0 : diffX, diffY < 0 ? 0 : diffY];
    }

    render() {
        const [x, y] = this.pos;

        return html`<div
            id=${this.cardId}
            class=${classMap({
                card: true,
                "is-dragging": this.isDragging,
            })}
            style=${styleMap({
                transform: `translate(${x}px, ${y}px)`,
                zIndex: this.elevateZIndex,
                width: this.cardWidth,
            })}
            ${ref(this.cardRef)}
            @mousedown="${this.handleMouseDown}"
            @mouseup="${this.handleMouseUp}"
            @mousemove="${this.handleMouseMove}"
            @mouseleave="${
                this
                    .handleMouseUp /* This is to avoid mouse leaving the card too soon */
            }"
        >
            <slot></slot>
        </div> `;
    }
}
