import Observer from "./Observer";

export type Key = {
    key: string;
    id: string;
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

    add({ key, id }: Key): void {
        const keyMapping = new KeyMapping({ key, id });
        this.keys.set(keyMapping.key, keyMapping);
    }

    addKeys(keys: Key[]): void {
        keys.forEach(this.add.bind(this));
    }

    subscribe(callback: (key: KeyData) => void): () => void {
        this.observer.subscribe("keypress", callback);

        return () => this.observer.unsubscribe("keypress", callback);
    }

    createKeyListener(): void {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            if (this.keys.has(event.key)) {
                if (event.repeat) {
                    return;
                }
                for (const mapping of this.keys.values()) {
                    if (mapping.key === event.key) {
                        mapping.isPressed = true;
                        this.observer.notify("keypress", {
                            mapping: mapping,
                            event: event,
                        });
                    }
                }
            }
        });

        window.addEventListener("keyup", (event: KeyboardEvent) => {
            if (this.keys.has(event.key)) {
                if (event.repeat) {
                    return;
                }

                for (const mapping of this.keys.values()) {
                    if (mapping.key === event.key) {
                        mapping.isPressed = false;
                        this.observer.notify("keypress", {
                            mapping: mapping,
                            event: event,
                        });
                    }
                }
            }
        });
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

    isPressed: boolean = false;
    isDisabled: boolean = false;

    constructor({ key, id }: Key) {
        this.key = key;
        this.id = id;
    }
}
