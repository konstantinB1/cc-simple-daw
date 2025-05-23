import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("card-component")
export default class Card extends LitElement {
    @state()
    private pos: [number, number] = [0, 0];

    @state()
    private isDragging: boolean = false;

    @state()
    private elevateZIndex: number = 0;

    @property({ type: Array })
    public draggableClasses: string[] = [];

    @property({ type: String, attribute: "card-id" })
    private cardId: string = "";

    private dragOffset: [number, number] = [0, 0];

    private cardRef: Ref<HTMLElement> = createRef();

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
        }

        .card.is-dragging {
            border: 1px solid var(--color-tint-primary);
        }
    `;

    private get unsafeCardRefRect(): DOMRect {
        const value = this.cardRef.value;

        if (!value) {
            throw new Error("Card reference is not set");
        }

        return value.getBoundingClientRect();
    }

    private handleMouseDown(event: MouseEvent): void {
        const el = event.target as HTMLElement;
        console.log(el.classList);
        const classes = [...this.draggableClasses, "card"];

        // if (!classes.some((className) => el.classList.contains(className))) {
        //     return;
        // }

        this.isDragging = true;
        this.dragOffset = [
            event.clientX - this.unsafeCardRefRect.left,
            event.clientY - this.unsafeCardRefRect.top,
        ];

        this.elevateZIndex = 1000;
    }

    private handleMouseUp(_: MouseEvent): void {
        this.isDragging = false;
        this.elevateZIndex = 0;
        this.dragOffset = [0, 0];
    }

    private handleMouseMove(event: MouseEvent): void {
        if (!this.isDragging) {
            return;
        }

        const [offsetX, offsetY] = this.dragOffset;
        const diffX = event.clientX - offsetX;
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
            })}
            ${ref(this.cardRef)}
            @mousedown="${this.handleMouseDown}"
            @mouseup="${this.handleMouseUp}"
            @mousemove="${this.handleMouseMove}"
        >
            <slot></slot>
        </div> `;
    }
}
