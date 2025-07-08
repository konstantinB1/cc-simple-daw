import { store } from "@/store/AppStore";
import { storeSubscriber } from "@/store/StoreLit";
import { html } from "@lit-labs/signals";

import { css, LitElement, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("bpm-picker")
export default class BpmPicker extends LitElement {
    private isDragging: boolean = false;
    private iconBounds: DOMRect | null = null;
    private clickedPixel: number = 0;

    @storeSubscriber(store, (state) => state.playback.bpm)
    private bpm!: number;

    static styles = [
        css`
            .bpm-picker {
                gap: 5px;
            }

            .bpm-input {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 40px;
                width: 70px;
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
        if (!this.isDragging) {
            return;
        }

        const mouseY = e.clientY - this.unsafeIconBounds.top;
        const diff = mouseY - this.clickedPixel;

        this.clickedPixel = mouseY;

        const diffBpm = Math.floor(diff / 2);

        if (diffBpm === 0) {
            return;
        }

        const currentBpm = this.bpm;

        const bpm =
            diffBpm > 0
                ? Math.max(0, currentBpm - diffBpm)
                : Math.min(999, currentBpm - diffBpm);

        store.setState((state) => {
            state.playback.bpm = bpm;
        });
    };

    private onMouseUp = () => {
        this.isDragging = false;
        this.clickedPixel = 0;
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("mouseup", this.onMouseUp);
    };

    private onKeyDown = (e: KeyboardEvent) => {
        let bpm: number | null = null;

        if (e.key === "ArrowUp") {
            bpm = Math.min(999, this.bpm + 1);
        } else if (e.key === "ArrowDown") {
            bpm = Math.max(0, this.bpm - 1);
        } else {
            return; // Ignore other keys
        }

        if (bpm === null) {
            throw new Error("BPM value is null somehow");
        }

        store.setState((state) => {
            state.playback.bpm = bpm;
        });
    };

    private handleFocus = () => {
        window.addEventListener("keydown", this.onKeyDown);
    };

    private handleBlur = () => {
        window.removeEventListener("keydown", this.onKeyDown);
    };

    render() {
        return html`<div
            tabindex="0"
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
        >
            <div class="bpm-input">
                <text-element size="sm" variant="h1" color="text" weight="400">
                    ${this.bpm}
                </text-element>
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
