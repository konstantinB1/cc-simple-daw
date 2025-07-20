import type {
    ReactiveElement,
    ReactiveController,
    ReactiveControllerHost,
    LitElement,
} from "lit";
import type Store from "./Store";
import type { WatcherCallback } from "./Watcher";

export function createStoreSubscriber<T extends object>(store: Store<T>) {
    return storeSubscriber(store);
}

export function storeSubscriber<T extends object, R = any>(
    store: Store<T>,
    selector?: (state: T) => R,
) {
    return function (target: LitElement, propertyKey: string | symbol) {
        (target.constructor as typeof ReactiveElement).addInitializer(
            (element) => {
                let prevValue: any;

                const controller: ReactiveController = {
                    hostConnected: () => {
                        const initialState = store.getState();
                        const selectorFn =
                            selector || ((s: T) => s[propertyKey as keyof T]);
                        const initialValue = selectorFn(initialState);

                        (element as any)[propertyKey] = initialValue;
                        prevValue = initialValue;
                    },
                    hostDisconnected: () => {
                        unwatch();
                    },
                };

                const unwatch = store.subscribe((state) => {
                    const selectorFn =
                        selector || ((s: T) => s[propertyKey as keyof T]);
                    const nextValue = selectorFn(state);

                    if (prevValue !== nextValue) {
                        const oldValue = prevValue;
                        prevValue = nextValue;

                        // Set the property value on the element
                        (element as any)[propertyKey] = nextValue;

                        // Trigger update with proper old/new values
                        element.requestUpdate(propertyKey, oldValue);
                    }
                });

                // Add the controller to manage lifecycle
                element.addController(controller);
            },
        );
    };
}

export type WatchMap = {
    [key: string]: WatcherCallback<any>;
};

export default class WatchController<T extends object>
    implements ReactiveController
{
    host: ReactiveControllerHost;
    private store: Store<T>;
    private watchMap: WatchMap;

    constructor(
        host: ReactiveControllerHost,
        store: Store<T>,
        watchMap: WatchMap,
    ) {
        this.host = host;
        this.store = store;
        this.watchMap = watchMap;

        this.host.addController(this);
    }

    hostConnected(): void {
        Object.entries(this.watchMap).forEach(([key, callback]) => {
            this.store.watch(key, (newValue, oldValue) => {
                callback(newValue, oldValue);
            });
        });
    }

    hostDisconnected(): void {
        this.store.clearWatchers(Object.keys(this.watchMap));
    }

    unwatch(key: string): void {
        this.store.clearWatchers([key]);
    }
}
