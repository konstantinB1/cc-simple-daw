import type { MappedPadKeyWithPressed } from "./Pads";

export type KeyPressedEvent = CustomEvent<{
    key: MappedPadKeyWithPressed;
    pressed: boolean;
}>;

export default class SamplerKeys extends EventTarget {
    private keys: Map<string, MappedPadKeyWithPressed> = new Map();

    private pressedKeys: Set<string> = new Set();

    constructor() {
        super();

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    attachEventListeners(): void {
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    detachEventListeners(): void {
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    private pressedEvent(
        key: MappedPadKeyWithPressed,
        pressed: boolean,
    ): KeyPressedEvent {
        return new CustomEvent("key-pressed", {
            detail: { key, pressed },
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        if (this.keys.has(key)) {
            const padKey = this.keys.get(key);
            if (padKey && !padKey.pressed) {
                padKey.pressed = true;
                this.pressedKeys.add(key);
                this.dispatchEvent(this.pressedEvent(padKey, true));
            }
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        if (this.keys.has(key)) {
            const padKey = this.keys.get(key);
            if (padKey && padKey.pressed) {
                padKey.pressed = false;
                this.pressedKeys.delete(key);
                this.dispatchEvent(this.pressedEvent(padKey, false));
            }
        }
    }
}
