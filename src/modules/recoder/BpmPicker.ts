import { typography } from "@/global-styles";
import { css, html, LitElement, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("bpm-picker")
export default class BpmPicker extends LitElement {
    @property({ type: Number })
    bpm: number = 120;

    private isDragging: boolean = false;
    private iconBounds: DOMRect | null = null;
    private clickedPixel: number = 0;

    static styles = [
        typography,
        css`
            .bpm-picker {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                gap: 5px;
            }

            .bpm-text {
                font-size: 1.2em;
                width: 40px;
            }

            .bpm-input {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 40px;
                gap: 20px;
                border-radius: var(--border-radius);
                background-color: var(--color-primary);
                color: var(--color-text);
                padding: 0 16px;
            }

            .bpm-input-icon-wrapper {
                cursor: grab;
            }
        `,
    ];

    get unsafeIconBounds(): DOMRect {
        if (!this.iconBounds) {
            throw new Error("Icon bounds not found");
        }

        return this.iconBounds;
    }

    protected firstUpdated(_: PropertyValues): void {
        if (!this.iconBounds) {
            const bounds = this.shadowRoot
                ?.querySelector(".bpm-input-icon-wrapper")
                ?.getBoundingClientRect();

            if (!bounds) {
                throw new Error("Icon bounds not found");
            }

            this.iconBounds = bounds;
        }
    }

    private onMouseDown = (e: MouseEvent) => {
        this.isDragging = true;
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("mouseup", this.onMouseUp);
        this.clickedPixel = e.clientY - this.unsafeIconBounds.top;
    };

    private onMouseMove = (e: MouseEvent) => {
        if (!this.isDragging) return;

        const mouseY = e.clientY - this.unsafeIconBounds.top;
        const diff = mouseY - this.clickedPixel;
        this.clickedPixel = mouseY;
        const diffBpm = Math.floor(diff / 2);

        if (diffBpm === 0) {
            return;
        }

        if (diffBpm > 0) {
            this.bpm = Math.max(0, this.bpm - diffBpm);
        } else {
            this.bpm = Math.min(999, this.bpm - diffBpm);
        }

        this.dispatchEvent(
            new CustomEvent("bpm-changed", {
                detail: {
                    bpm: this.bpm,
                },
                bubbles: true,
                composed: true,
            }),
        );
    };

    private onMouseUp = () => {
        this.isDragging = false;
        this.clickedPixel = 0;
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    };

    render() {
        return html`<div class="bpm-picker">
            <div class="bpm-input">
                <p class="typography-300 bpm-text">${this.bpm}</p>
                <div
                    class="bpm-input-icon-wrapper"
                    @mousedown=${this.onMouseDown}
                >
                    <up-down-icon></up-down-icon>
                </div>
            </div>
        </div> `;
    }
}
