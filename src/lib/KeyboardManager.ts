export class KeyMapping {
    keys: string[];
    index?: number;
    handler?: (...args: any) => void;
    active: boolean = true;
    description?: string;
    name?: string;

    constructor(
        keys: string[],
        index?: number,
        handler?: (...args: any) => void,
        active: boolean = true,
        description?: string,
        name?: string,
    ) {
        this.keys = keys;
        this.index = index;
        this.handler = handler;
        this.description = description;
        this.name = name;
        this.active = active;
    }
}

export class KeyMappingWithPressed extends KeyMapping {
    pressed: boolean;
    startTime?: number;
    duration?: number;
    endTime?: number;
    oneShot: boolean;

    constructor(
        keys: string[],
        index?: number,
        handler?: (...args: any) => void,
        active: boolean = true,
        description?: string,
        name?: string,
        pressed: boolean = false,
        oneShot: boolean = true,
    ) {
        super(keys, index, handler, active, description, name);
        this.pressed = pressed;
        this.oneShot = oneShot;
    }
}

export type KeyData = {
    mapping: KeyMappingWithPressed;
    pressed: boolean;
};

export type KeyDataEvent = CustomEvent<KeyData>;

export type KeyWithPressed<T> = T & {
    pressed: boolean;
};

export type SimpleKeyboardManager<T> = CustomEvent<{
    key: KeyWithPressed<T>;
    pressed: boolean;
}>;

export type PressedKeyMetadata = {
    startTime: number;
};

export interface KeyboardManager<T> {
    attachEventListeners(): void;
    detachEventListeners(): void;
    add(keys: string[], mapping: T): void;
    addKeys(keys: T[]): void;
    remove(keys: string[]): void;
    removeKeys(keys: T[]): void;
    onMappingHit(callback: (event: CustomEvent<T>) => void): void;
    attached: boolean;
}

export class SimpleKeyboardKanager
    extends EventTarget
    implements KeyboardManager<KeyMappingWithPressed>
{
    keys: Map<string, KeyMappingWithPressed> = new Map();

    private pressedKeys: Set<string> = new Set();

    private pressedKeysMetadata: Map<string, PressedKeyMetadata> = new Map();

    attached: boolean = false;

    constructor() {
        super();

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    attachEventListeners(): void {
        console.log("SimpleKeyboardKanager: Attaching event listeners.");

        if (this.attached) {
            console.warn(
                "SimpleKeyboardKanager: Event listeners already attached.",
            );
            return;
        }

        this.attached = true;
        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
    }

    detachEventListeners(): void {
        if (!this.attached) {
            console.warn(
                "SimpleKeyboardKanager: No event listeners to detach.",
            );
            return;
        }

        this.attached = false;
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keyup", this.handleKeyUp);
    }

    add(keys: string[], mapping: KeyMappingWithPressed): void {
        const key = keys.join("-").toLowerCase();
        this.keys.set(key, mapping);
    }

    addKeys(keys: KeyMappingWithPressed[]): void {
        keys.forEach((mapping) => {
            this.add(mapping.keys, mapping);
        });
    }

    remove(keys: string[]): void {
        const key = keys.join("-").toLowerCase();
        this.keys.delete(key);
    }

    removeKeys(keys: KeyMappingWithPressed[]): void {
        keys.forEach((mapping) => {
            this.remove(mapping.keys);
        });
    }

    // @ts-ignore
    onMappingHit(callback: (event: KeyDataEvent) => void): void {
        this.addEventListener("key-pressed", (event: Event) => {
            callback(event as KeyDataEvent);
        });
    }

    private pressedEvent(
        mapping: KeyMappingWithPressed,
        pressed: boolean,
    ): KeyDataEvent {
        return new CustomEvent<KeyData>("key-pressed", {
            detail: { mapping, pressed },
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        if (this.keys.has(key)) {
            const padKey = this.keys.get(key);

            if (padKey && !padKey.pressed) {
                padKey.pressed = true;

                this.pressedKeysMetadata.set(key, {
                    startTime: performance.now(),
                });

                this.dispatchEvent(this.pressedEvent(padKey, true));
            }
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const key = event.key.toLowerCase();
        if (this.keys.has(key)) {
            const metadata = this.pressedKeysMetadata.get(key);

            if (!metadata) {
                throw new Error(`No metadata found for key: ${key}`);
            }

            const padKey = this.keys.get(key);
            if (padKey && padKey.pressed) {
                padKey.pressed = false;

                padKey.startTime = metadata.startTime;
                padKey.endTime = performance.now();
                padKey.duration = padKey.endTime - padKey.startTime;

                this.dispatchEvent(this.pressedEvent(padKey, false));
            }
        }
    }
}

export class LayeredKeyboardManager
    extends EventTarget
    implements KeyboardManager<KeyMapping>
{
    private keyMappings: Map<string, KeyMapping> = new Map();

    private currentCombination: string[] = [];

    private interval: NodeJS.Timeout | null = null;

    attached: boolean = false;

    private currentKeys: string[] = [];

    constructor() {
        super();
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    add(keys: string[], mapping: KeyMapping): void {
        const key = keys.join("-").toLowerCase();
        this.keyMappings.set(key, mapping);
    }

    addKeys(keys: KeyMapping[]): void {
        keys.forEach((mapping) => {
            this.add(mapping.keys, mapping);
        });
    }

    remove(keys: string[]): void {
        const key = keys.join("-").toLowerCase();
        this.keyMappings.delete(key);
    }

    removeKeys(keys: KeyMapping[]): void {
        keys.forEach((mapping) => {
            this.remove(mapping.keys);
        });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        let key = event.key.toLowerCase();

        if ("code" in event && event.code === "Space") {
            key = event.code.toLowerCase();
        }

        const prevKey =
            this.currentCombination[this.currentCombination.length - 1];

        if (prevKey === key) {
            return;
        }

        this.currentCombination.push(key);

        const keyCombination =
            this.currentCombination.length === 1
                ? key
                : this.currentCombination.join("-").toLowerCase();

        if (this.currentCombination.length > 3) {
            this.currentCombination.shift();
        }

        if (this.keyMappings.has(keyCombination)) {
            const mapping = this.keyMappings.get(keyCombination);

            if (!mapping || !mapping.active) {
                return;
            }

            mapping.handler?.();

            this.dispatchEvent(
                new CustomEvent<KeyMapping>("mapping-hit", {
                    detail: mapping,
                    bubbles: true,
                    composed: true,
                }),
            );

            this.currentKeys.push(keyCombination);
        }

        if (this.interval) {
            clearTimeout(this.interval);
        }

        this.interval = setTimeout(() => {
            this.currentCombination = [];
        }, 300);
    }

    onMappingHit(callback: (event: CustomEvent<KeyMapping>) => void): void {
        this.addEventListener("mapping-hit", (event: Event) => {
            callback(event as CustomEvent<KeyMapping>);
        });
    }

    attachEventListeners(): void {
        if (this.attached) {
            console.warn("KeyboardManager: Event listeners already attached.");
            return;
        }

        this.attached = true;
        document.addEventListener("keydown", this.handleKeyDown);
    }

    detachEventListeners(): void {
        if (!this.attached) {
            console.warn("KeyboardManager: No event listeners to detach.");
            return;
        }

        this.attached = false;
        document.removeEventListener("keydown", this.handleKeyDown);

        console.log("KeyboardManager: Event listeners detached.");
    }
}
