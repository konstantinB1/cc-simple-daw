import { ObjectPath } from "@/utils/utils";
import type Store from "./Store";

export type WatcherCallback<T> = (newValue: T, oldValue: T) => void;

export default class Watcher<P, T extends object = any> {
    private cachedPathObservers: Map<string, () => void> = new Map();

    constructor(
        store?: Store<T>,
        path?: string,
        callback?: WatcherCallback<P>,
    ) {
        if (store && path && callback) {
            this.watch(store, path, callback);
        }
    }

    watch(
        store: Store<T>,
        path: string,
        callback: WatcherCallback<P>,
    ): (() => void) | undefined {
        if (this.cachedPathObservers.has(path)) {
            return;
        }

        let prevValue: P;

        const unsub = store.subscribe((state) => {
            const value = ObjectPath.get(state, path) as P;

            if (value !== prevValue) {
                callback(value, prevValue);
            }

            prevValue = value;
        });

        this.cachedPathObservers.set(path, unsub);

        return () => {
            const observer = this.cachedPathObservers.get(path);

            if (observer) {
                observer();
                this.cachedPathObservers.delete(path);
            }
        };
    }

    unwatch(path?: string): void {
        if (!path) {
            this.cachedPathObservers.forEach((observer) => observer());
            this.cachedPathObservers.clear();
        } else {
            const observer = this.cachedPathObservers.get(path);

            if (observer) {
                observer();
                this.cachedPathObservers.delete(path);
            }
        }
    }
}
