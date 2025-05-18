import Observer from "./Observer";

export type Key = {
    key: string;
    id: string;
    pressable?: boolean;
    handler?: (event: KeyboardEvent) => void;
};

export type KeyData = {
    mapping: KeyMapping;
    event: KeyboardEvent;
};

export class KeyManager {
    private keys: Map<string, KeyMapping> = new Map();
    private observer = new Observer();
    private static instance: KeyManager;

    static getInstance(): KeyManager {
        if (!KeyManager.instance) {
            KeyManager.instance = new KeyManager();
        }

        return KeyManager.instance;
    }

    add({ key, id, pressable = true, handler }: Key): void {
        const keyMapping = new KeyMapping({
            key,
            id,
            pressable: pressable,
            handler,
        });

        if (this.keys.has(keyMapping.key)) {
            throw new Error(
                `Key ${keyMapping.key} is already mapped to ${this.keys.get(keyMapping.key)?.id}`,
            );
        }

        this.keys.set(keyMapping.key, keyMapping);
    }

    addKeys(keys: Key[]): void {
        keys.forEach(this.add.bind(this));
    }

    subscribe(callback: (key: KeyData) => void): () => void {
        this.observer.subscribe("keypress", callback);

        return () => this.observer.unsubscribe("keypress", callback);
    }

    private handleKeyboardEvent(
        pressed: boolean,
    ): (event: KeyboardEvent) => void {
        return (event: KeyboardEvent) => {
            if (this.keys.has(event.key)) {
                if (event.repeat) {
                    return;
                }

                for (const mapping of this.keys.values()) {
                    if (mapping.key === event.key) {
                        if (mapping.isDisabled) {
                            return;
                        }

                        if (mapping?.pressable) {
                            mapping.isPressed = pressed;

                            mapping.handler?.(event);

                            this.observer.notify("keypress", {
                                mapping: mapping,
                                event: event,
                            });
                        }
                    }
                }
            }
        };
    }

    createKeyListener(): void {
        window.addEventListener("keydown", this.handleKeyboardEvent(true));
        window.addEventListener("keyup", this.handleKeyboardEvent(false));
    }

    toggleEnabled(key: string, enabled: boolean): void {
        if (this.keys.has(key)) {
            const mapping = this.keys.get(key);

            if (mapping) {
                mapping.isDisabled = !enabled;
            }
        }
    }
}

interface IKeyMapping {
    isPressed: boolean;
}

export class KeyMapping implements IKeyMapping {
    key: string;
    id: string;
    pressable?: boolean = true;
    handler?: (event: KeyboardEvent) => void;

    isPressed: boolean = false;
    isDisabled: boolean = false;

    constructor({ key, id, pressable, handler }: Key) {
        this.key = key;
        this.id = id;
        this.pressable = pressable;
        this.handler = handler;
    }
}
