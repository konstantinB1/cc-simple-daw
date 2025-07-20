import UpAndDownIcon from "@/components/icons/UpAndDownIcon";
import TextElement from "@/components/Text";
import { store } from "@/store/AppStore";
import { storeSubscriber } from "@/store/StoreLit";
import { helperStyles } from "@/styles";
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";

import { css, html, LitElement, type PropertyValues } from "lit";
import { queryAsync } from "lit/decorators.js";

export const MAX_BPM = 200;
export const MIN_BPM = 10;

export default class BpmPicker extends ScopedRegistryHost(LitElement) {
    private isDragging: boolean = false;
    private iconBounds: DOMRect | null = null;
    private clickedPixel: number = 0;

    @queryAsync("#bpm-drag-icon")
    private icon!: Promise<HTMLElement>;

    @storeSubscriber(store, (state) => state.playback.bpm)
    private bpm!: number;

    static elementDefinitions = {
        "text-element": TextElement,
        "up-down-icon": UpAndDownIcon,
    };

    static styles = [
        helperStyles,
        css`
            .bpm-input {
                height: 40px;
                width: 70px;
            }
        `,
    ];

    get unsafeIconBounds(): DOMRect {
        if (!this.iconBounds) {
            throw new Error("Icon bounds not found");
        }

        return this.iconBounds;
    }

    protected async firstUpdated(_: PropertyValues): Promise<void> {
        super.firstUpdated(_);

        const icon = await this.icon;
        this.iconBounds = icon.getBoundingClientRect();
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
                ? Math.max(MIN_BPM, currentBpm - diffBpm)
                : Math.min(MAX_BPM, currentBpm - diffBpm);

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
            <div
                class="bpm-input flex flex-space-between px-3 bg-primary radius-normal"
            >
                <text-element size="sm" variant="h1" color="text" weight="400">
                    ${this.bpm}
                </text-element>
                <div
                    class="cursor-grab"
                    id="bpm-drag-icon"
                    @mousedown=${this.onMouseDown}
                >
                    <up-down-icon></up-down-icon>
                </div>
            </div>
        </div> `;
    }
}
