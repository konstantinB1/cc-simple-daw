import { produce, type PatchListener } from "immer";
import Watcher, { type WatcherCallback } from "./Watcher";

export default class Store<T extends object> {
    protected state: T;
    private subscribers: Set<(state: T) => void> = new Set();
    private watchers: Map<string, Watcher<any>> = new Map();

    constructor(initialState: T) {
        this.state = initialState;
    }

    getState(): T {
        return this.state;
    }

    subscribe(callback: (state: T) => void): () => void {
        this.subscribers.add(callback);
        callback(this.state);

        return () => {
            this.subscribers.delete(callback);
        };
    }

    /// We should not use this method directly in components.
    /// Should rely on the class that extends this Store class to provide
    /// a more specific method for setting state.
    /// Change this method to `protected` when we define better structure for the store.
    setState(setter: (state: T) => void, patches?: PatchListener): void {
        const nextState = produce(this.state, setter, patches);

        if (nextState === this.state) {
            return;
        }

        this.state = nextState;

        this.runSubscribers();
    }

    private runSubscribers(): void {
        this.subscribers.forEach((callback) => callback(this.state));
    }

    watch<T>(key: string, callback: WatcherCallback<T>): () => void {
        if (!this.watchers.has(key)) {
            this.watchers.set(key, new Watcher<T>(this, key, callback));
        }

        const watcher = this.watchers.get(key)!;

        return () => {
            watcher.unwatch();
            this.watchers.delete(key);
        };
    }

    clearWatchers(keys?: string[]): void {
        if (keys) {
            keys.forEach((key) => {
                const watcher = this.watchers.get(key);

                if (watcher) {
                    watcher.unwatch();
                    this.watchers.delete(key);
                }
            });
        } else {
            this.watchers.forEach((watcher) => watcher.unwatch());
            this.watchers.clear();
        }
    }
}
