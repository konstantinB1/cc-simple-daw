export default class Observer<T extends (data?: any) => void> {
    private observers: { [key: string]: T[] } = {};

    subscribe(event: string, callback: T): void {
        if (!this.observers[event]) {
            this.observers[event] = [];
        }
        this.observers[event].push(callback);
    }

    unsubscribe(event: string, callback: T): void {
        if (!this.observers[event]) return;

        this.observers[event] = this.observers[event].filter(
            (observer) => observer !== callback,
        );
    }

    notify(event: string, data?: any): void {
        if (!this.observers[event]) return;

        this.observers[event].forEach((callback) => callback(data));
    }

    clear(event: string): void {
        if (this.observers[event]) {
            this.observers[event] = [];
        }
    }

    clearAll(): void {
        this.observers = {};
    }
}
