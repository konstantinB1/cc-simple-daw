type Callback<T> = (data: T) => void;

export default class Observer<T> {
    private observers: { [key: string]: Callback<T>[] } = {};

    subscribe(event: string, callback: Callback<T>): void {
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

    notify(event: string, data: T): void {
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
