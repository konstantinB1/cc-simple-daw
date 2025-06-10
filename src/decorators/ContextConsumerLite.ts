import {
    type Context,
    type ContextCallback,
    type ContextType,
    ContextEvent,
} from "@lit/context";
import type {
    ReactiveController,
    ReactiveControllerHost,
} from "@lit/reactive-element";

export interface Options<C extends Context<unknown, unknown>> {
    context: C;
    callback?: (value: ContextType<C>, dispose?: () => void) => void;
    subscribe?: boolean;
}

// Exactly the same as ContextConsumer, removes bunch of deprecated code,
// and comments, and most importantly, it does not trigger a requestUpdate
// when the context value changes, but it allows you to
// use a callback to handle the changes manually, depending on the use case.
export class ContextConsumerLite<
    C extends Context<unknown, unknown>,
    HostElement extends ReactiveControllerHost & HTMLElement,
> implements ReactiveController
{
    protected host: HostElement;
    private context: C;
    private callback?: (value: ContextType<C>, dispose?: () => void) => void;
    private subscribe = false;

    private provided = false;

    value?: ContextType<C> = undefined;

    constructor(
        host: HostElement,
        { context, callback, subscribe = false }: Options<C>,
    ) {
        this.host = host;
        this.context = context;
        this.callback = callback;
        this.subscribe = subscribe ?? false;

        this.host.addController(this);
    }

    private unsubscribe?: () => void;

    hostConnected(): void {
        this.dispatchRequest();
    }

    hostDisconnected(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = undefined;
        }
    }

    private dispatchRequest() {
        this.host.dispatchEvent(
            new ContextEvent(
                this.context,
                this.host,
                this._callback,
                this.subscribe,
            ),
        );
    }

    private _callback: ContextCallback<ContextType<C>> = (
        value,
        unsubscribe,
    ) => {
        if (this.unsubscribe) {
            if (this.unsubscribe !== unsubscribe) {
                this.provided = false;
                this.unsubscribe();
            }

            if (!this.subscribe) {
                this.unsubscribe();
            }
        }

        this.value = value;

        if (!this.provided || this.subscribe) {
            this.provided = true;
            if (this.callback) {
                this.callback(value, unsubscribe);
            }
        }

        this.unsubscribe = unsubscribe;
    };
}
